package edu.miu.cs.cs425.backend.application.commandhandler;

import edu.miu.cs.cs425.backend.application.command.CreateBookingCommand;
import edu.miu.cs.cs425.backend.data.repository.BookingRepository;
import edu.miu.cs.cs425.backend.data.repository.FlightRepository;
import edu.miu.cs.cs425.backend.domain.entity.Booking;
import edu.miu.cs.cs425.backend.domain.entity.Flight;
import edu.miu.cs.cs425.backend.domain.entity.FlightLeg;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingCommandHandler {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;

    public BookingCommandHandler(BookingRepository bookingRepository, FlightRepository flightRepository) {
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
    }


    @Transactional
    public Booking handle(CreateBookingCommand command) {
        // Create Booking entity
        Booking booking = new Booking();
        booking.setUserId(command.getUserId());
        booking.setTotalPrice(command.getTotalPrice());
        booking.setFareType(command.getFareType());
        booking.setUserDetails(command.getUserDetails());
        booking.setSelectedSeat(command.getSelectedSeat());
        booking.setStatus(command.getStatus());
        // Parse ISO 8601 date with UTC and convert to LocalDateTime
        Instant instant = Instant.parse(command.getBookingDate());
        booking.setCreatedAt(LocalDateTime.ofInstant(instant, ZoneId.systemDefault()));

        // Map outbound flight legs
        List<FlightLeg> flightLegs = new ArrayList<>();
        for (int i = 0; i < command.getItinerary().getFlights().size(); i++) {
            String flightId = command.getItinerary().getFlights().get(i).getId();
            Flight flight = flightRepository.findById(flightId)
                    .orElseThrow(() -> new IllegalArgumentException("Flight not found: " + flightId));
            FlightLeg leg = new FlightLeg();
            leg.setFlight(flight);
            leg.setLegNumber(i + 1);
            flightLegs.add(leg);
        }
        booking.setFlightLegs(flightLegs);

        // Map return flight legs (if present)
        if (command.getItinerary().getReturnFlights() != null && !command.getItinerary().getReturnFlights().isEmpty()) {
            List<FlightLeg> returnLegs = new ArrayList<>();
            for (int i = 0; i < command.getItinerary().getReturnFlights().size(); i++) {
                String flightId = command.getItinerary().getReturnFlights().get(i).getId();
                Flight flight = flightRepository.findById(flightId)
                        .orElseThrow(() -> new IllegalArgumentException("Flight not found: " + flightId));
                FlightLeg leg = new FlightLeg();
                leg.setFlight(flight);
                leg.setLegNumber(i + 1);
                returnLegs.add(leg);
            }
            booking.setReturnFlightLegs(returnLegs);
        }

        return bookingRepository.save(booking);
    }
}
