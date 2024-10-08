export type RestaurantData = {
    InputString: string;
    Id: string;
    GoogleLink: string;
    Name: string;
    Category: string;
    Address: string;
    Website: string;
    Phone: string;
    Rating: number;
    CountPerRating: string[];
    RatingCount: string;
    OpeningHours: string[];
    Latitude: number | null;
    Longitude: number | null;
    Images: string[];
    Reviews: string[];
    AiReviewSummary: string;
    Tags: string[];
    ChainRestaurantId: string | null;
    Success: boolean;
    CreatedAt: string;
};
