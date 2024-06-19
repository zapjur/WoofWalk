declare module 'react-native-map-clustering' {
    import * as React from 'react';
    import { MapViewProps } from 'react-native-maps';

    interface ClusterProps extends MapViewProps {
        radius?: number;
        maxZoomLevel?: number;
        minZoomLevel?: number;
        extent?: number;
        clusterStyle?: object;
        clusterTextStyle?: object;
        onClusterPress?: (cluster: any, markers: any[]) => void;
        onClusterPressChild?: (marker: any) => void;
    }

    const ClusteredMapView: React.FC<ClusterProps>;
    export default ClusteredMapView;
}