from pymongo import MongoClient
from datetime import datetime
from bcrypt import hashpw, gensalt

# MongoDB connection URI
uri = "mongodb://localhost:27017"  # Replace with your MongoDB URI
db_name = "flight-booking"  # Replace with your database name

# Sample data
airports = [
    {
        "iataCode": "JFK",
        "name": "John F. Kennedy International Airport",
        "city": "New York",
        "country": "USA",
    },
    {
        "iataCode": "LAX",
        "name": "Los Angeles International Airport",
        "city": "Los Angeles",
        "country": "USA",
    },
    {
        "iataCode": "LHR",
        "name": "Heathrow Airport",
        "city": "London",
        "country": "UK",
    },
    {
        "iataCode": "CDG",
        "name": "Charles de Gaulle Airport",
        "city": "Paris",
        "country": "France",
    },
    {
        "iataCode": "DXB",
        "name": "Dubai International Airport",
        "city": "Dubai",
        "country": "UAE",
    },
]

airlines = [
    {
        "code": "DL",
        "name": "Delta Airlines",
        "logoUrl": "https://example.com/delta-logo.png",
    },
    {
        "code": "AA",
        "name": "American Airlines",
        "logoUrl": "https://example.com/american-logo.png",
    },
    {
        "code": "BA",
        "name": "British Airways",
        "logoUrl": "https://example.com/british-logo.png",
    },
    {
        "code": "AF",
        "name": "Air France",
        "logoUrl": "https://example.com/airfrance-logo.png",
    },
    {
        "code": "EK",
        "name": "Emirates",
        "logoUrl": "https://example.com/emirates-logo.png",
    },
]

flights = [
    {
        "flightNumber": "DL123",
        "airline": None,  # Will be replaced with airline ID
        "origin": None,  # Will be replaced with airport ID
        "destination": None,  # Will be replaced with airport ID
        "departure": datetime(2023, 12, 1, 10, 0, 0),
        "arrival": datetime(2023, 12, 1, 16, 15, 0),
        "duration": 375,
        "price": 350,
        "seatsAvailable": 150,
    },
    {
        "flightNumber": "AA456",
        "airline": None,  # Will be replaced with airline ID
        "origin": None,  # Will be replaced with airport ID
        "destination": None,  # Will be replaced with airport ID
        "departure": datetime(2023, 12, 5, 8, 0, 0),
        "arrival": datetime(2023, 12, 5, 14, 30, 0),
        "duration": 390,
        "price": 400,
        "seatsAvailable": 200,
    },
]

# Main function to populate the database
def populate_database():
    client = MongoClient(uri)
    db = client[db_name]

    try:
        # Insert airports
        airport_insert_result = db.airports.insert_many(airports)
        print(f"{len(airport_insert_result.inserted_ids)} airports inserted")

        # Insert airlines
        airline_insert_result = db.airlines.insert_many(airlines)
        print(f"{len(airline_insert_result.inserted_ids)} airlines inserted")

        # Insert flights
        airport_ids = airport_insert_result.inserted_ids
        airline_ids = airline_insert_result.inserted_ids

        for i, flight in enumerate(flights):
            flight["airline"] = airline_ids[i % len(airline_ids)]
            flight["origin"] = airport_ids[i % len(airport_ids)]
            flight["destination"] = airport_ids[(i + 1) % len(airport_ids)]

        flight_insert_result = db.flights.insert_many(flights)
        print(f"{len(flight_insert_result.inserted_ids)} flights inserted")

    except Exception as e:
        print(f"Error populating database: {e}")
    finally:
        client.close()
        print("Disconnected from MongoDB")

# Run the script
if __name__ == "__main__":
    populate_database()