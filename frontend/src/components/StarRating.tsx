import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface StarRatingProps {
    rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating , fontSize}) => {
    const maxRating = 5;
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
        if (i <= rating) {
            stars.push(
                <FontAwesome
                    key={i}
                    name="star"
                    size={fontSize}
                    color="#FFD700"
                />
            );
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(
                <FontAwesome
                    key={i}
                    name="star-half-o"
                    size={fontSize}
                    color="#FFD700"
                />
            );
        } else {
            stars.push(
                <FontAwesome
                    key={i}
                    name="star-o"
                    size={fontSize}
                    color="#FFD700"
                />
            );
        }
    }

    return (
        <View style={styles.container}>
            {stars}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default StarRating;
