import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import axios from 'axios';
import jwt, { GetPublicKeyOrSecret, JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

interface AuthConfig {
    domain: string;
    audience: string;
}

let auth0Domain = '';
let audience = '';

const fetchAuthConfig = async () => {
    try {
        const response = await axios.get<AuthConfig>('http://localhost:8080/auth-config');
        auth0Domain = response.data.domain.replace(/\/$/, '');
        audience = response.data.audience;
        console.log('Fetched Auth0 configuration:', response.data);
    } catch (error) {
        console.error('Error fetching Auth0 configuration from backend:', error);
    }
};

const initializeServer = async () => {
    await fetchAuthConfig();

    const client = jwksRsa({
        cache: true,
        rateLimit: true,
        jwksUri: `${auth0Domain}/.well-known/jwks.json`
    });

    const getKey: GetPublicKeyOrSecret = (header: JwtHeader, callback: SigningKeyCallback) => {
        client.getSigningKey(header.kid, (err, key) => {
            if (err || !key) {
                console.error('Error getting signing key:', err);
                callback(err);
                return;
            }
            const signingKey = key.getPublicKey();
            console.log('Signing key:', signingKey);
            callback(null, signingKey);
        });
    };

    const checkJwt = (socket: Socket, next: (err?: Error) => void) => {
        const token = socket.handshake.auth.token;
        console.log('Token received:', token);
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        const tokenWithoutBearer = token.replace('Bearer ', '');

        jwt.verify(tokenWithoutBearer, getKey, {
            audience: audience,
            issuer: `${auth0Domain}/`,
            algorithms: ['RS256']
        }, (err, decoded) => {
            if (err) {
                console.error('JWT verification error:', err);
                return next(new Error('Authentication error: JWT verification failed'));
            }
            (socket as any).decoded = decoded;
            console.log('JWT decoded:', decoded);
            next();
        });
    };

    app.use(cors({
        origin: '*'
    }));

    io.use(checkJwt);

    const userSockets = new Map();

    io.on('connection', (socket: Socket) => {
        console.log('A user connected:', socket.id);
        const userSub = (socket as any).decoded.sub;
        userSockets.set(userSub, socket.id);

        socket.on('private_message', async ({ content, to }: { content: string; to: string }) => {
            console.log('Private message received:', content, 'to:', to);

            try {
                const recipientSocketId = userSockets.get(to);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('private_message', { content, sender: userSub });
                    console.log('Message sent to recipient:', recipientSocketId);
                } else {
                    console.log('Recipient not found:', to);
                }

                const token = socket.handshake.auth.token;
                const timestamp = Date.now();
                const messageData = { content, recipient: to, sender: userSub, timestamp };
                console.log('Message data to be sent:', messageData);
                await axios.post('http://localhost:8080/messages/save', messageData, {
                    headers: {
                        Authorization: token
                    }
                });
                console.log('Message saved to Spring Boot server');
            } catch (error) {
                console.error('Error fetching recipient sub or sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            userSockets.delete(userSub);
        });
    });

    server.listen(3000, () => {
        console.log('Listening on *:3000');
    });
};

initializeServer();
