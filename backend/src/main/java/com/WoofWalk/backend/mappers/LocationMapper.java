package com.WoofWalk.backend.mappers;

import com.WoofWalk.backend.dto.LocationDto;
import com.WoofWalk.backend.entities.Location;

public class LocationMapper {

    public static Location toEntity(LocationDto dto) {
        Location location = new Location();
        location.setName(dto.getName());
        location.setDescription(dto.getDescription());
        location.setLatitude(dto.getLatitude());
        location.setLongitude(dto.getLongitude());
        location.setCategory(dto.getCategory());
        location.setDate(dto.getDate());
        return location;
    }

    public static LocationDto toDto(Location entity) {
        LocationDto dto = new LocationDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setRating(entity.getRating());
        dto.setRatingCount(entity.getRatingCount());
        dto.setCategory(entity.getCategory());
        dto.setDate(entity.getDate());
        return dto;
    }
}
