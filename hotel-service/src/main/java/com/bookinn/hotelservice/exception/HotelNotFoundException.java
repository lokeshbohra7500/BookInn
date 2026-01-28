package com.bookinn.hotelservice.exception;

public class HotelNotFoundException extends RuntimeException {
    public HotelNotFoundException(String msg) {
        super(msg);
    }
}
