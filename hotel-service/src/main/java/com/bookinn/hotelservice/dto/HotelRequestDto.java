package com.bookinn.hotelservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelRequestDto {

    @NotBlank
    private String name;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String address;

    private String description;

    @NotNull
    private Integer starRating;
}
