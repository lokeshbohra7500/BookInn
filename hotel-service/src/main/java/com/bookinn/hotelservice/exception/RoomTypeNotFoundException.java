package com.bookinn.hotelservice.exception;

public class RoomTypeNotFoundException extends RuntimeException {
    public RoomTypeNotFoundException(String msg) {
        super(msg);
    }
}
