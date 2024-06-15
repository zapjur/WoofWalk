export interface DogSummary {
    id: number;
    name: string;
    breed: string;
    photo: string;
}

export const dogSexes = [
    { key: 1, label: "Male", value: "MALE" },
    { key: 2, label: "Female", value: "FEMALE" }
];

export const dogSizes = [
    { key: 1, label: "Small", value: "SMALL" },
    { key: 2, label: "Medium", value: "MEDIUM" },
    { key: 3, label: "Large", value: "LARGE" }
];

export const dogAges = [
    { key: 1, label: "Puppy", value: "PUPPY" },
    { key: 2, label: "Young", value: "YOUNG" },
    { key: 3, label: "Adult", value: "ADULT" },
    { key: 4, label: "Senior", value: "SENIOR" }
];

export const dogBreeds = [
    { key: 1, label: "Afghan Hound", value: "AFGHAN_HOUND" },
    { key: 2, label: "Airedale Terrier", value: "AIREDALE_TERRIER" },
    { key: 3, label: "Akita", value: "AKITA" },
    { key: 4, label: "Alaskan Malamute", value: "ALASKAN_MALAMUTE" },
    { key: 5, label: "American Bulldog", value: "AMERICAN_BULLDOG" },
    { key: 6, label: "American Pit Bull Terrier", value: "AMERICAN_PIT_BULL_TERRIER" },
    { key: 7, label: "American Staffordshire Terrier", value: "AMERICAN_STAFFORDSHIRE_TERRIER" },
    { key: 8, label: "Australian Cattle Dog", value: "AUSTRALIAN_CATTLE_DOG" },
    { key: 9, label: "Australian Shepherd", value: "AUSTRALIAN_SHEPHERD" },
    { key: 10, label: "Basenji", value: "BASENJI" },
    { key: 11, label: "Basset Hound", value: "BASSET_HOUND" },
    { key: 12, label: "Beagle", value: "BEAGLE" },
    { key: 13, label: "Belgian Malinois", value: "BELGIAN_MALINOIS" },
    { key: 14, label: "Bernese Mountain Dog", value: "BERNESE_MOUNTAIN_DOG" },
    { key: 15, label: "Bichon Frise", value: "BICHON_FRISE" },
    { key: 16, label: "Bloodhound", value: "BLOODHOUND" },
    { key: 17, label: "Border Collie", value: "BORDER_COLLIE" },
    { key: 18, label: "Border Terrier", value: "BORDER_TERRIER" },
    { key: 19, label: "Boston Terrier", value: "BOSTON_TERRIER" },
    { key: 20, label: "Boxer", value: "BOXER" },
    { key: 21, label: "Bulldog", value: "BULLDOG" },
    { key: 22, label: "Bullmastiff", value: "BULLMASTIFF" },
    { key: 23, label: "Cairn Terrier", value: "CAIRN_TERRIER" },
    { key: 24, label: "Cane Corso", value: "CANE_CORSO" },
    { key: 25, label: "Cavalier King Charles Spaniel", value: "CAVALIER_KING_CHARLES_SPANIEL" },
    { key: 26, label: "Chihuahua", value: "CHIHUAHUA" },
    { key: 27, label: "Chinese Shar Pei", value: "CHINESE_SHAR_PEI" },
    { key: 28, label: "Chow Chow", value: "CHOW_CHOW" },
    { key: 29, label: "Cocker Spaniel", value: "COCKER_SPANIEL" },
    { key: 30, label: "Collie", value: "COLLIE" },
    { key: 31, label: "Dachshund", value: "DACHSHUND" },
    { key: 32, label: "Dalmatian", value: "DALMATIAN" },
    { key: 33, label: "Doberman Pinscher", value: "DOBERMAN_PINSCHER" },
    { key: 34, label: "English Setter", value: "ENGLISH_SETTER" },
    { key: 35, label: "English Springer Spaniel", value: "ENGLISH_SPRINGER_SPANIEL" },
    { key: 36, label: "French Bulldog", value: "FRENCH_BULLDOG" },
    { key: 37, label: "German Shepherd", value: "GERMAN_SHEPHERD" },
    { key: 38, label: "German Shorthaired Pointer", value: "GERMAN_SHORTHAIRED_POINTER" },
    { key: 39, label: "Golden Retriever", value: "GOLDEN_RETRIEVER" },
    { key: 40, label: "Great Dane", value: "GREAT_DANE" },
    { key: 41, label: "Great Pyrenees", value: "GREAT_PYRENEES" },
    { key: 42, label: "Greyhound", value: "GREYHOUND" },
    { key: 43, label: "Havanese", value: "HAVANESE" },
    { key: 44, label: "Irish Setter", value: "IRISH_SETTER" },
    { key: 45, label: "Irish Wolfhound", value: "IRISH_WOLFHOUND" },
    { key: 46, label: "Jack Russell Terrier", value: "JACK_RUSSELL_TERRIER" },
    { key: 47, label: "Japanese Chin", value: "JAPANESE_CHIN" },
    { key: 48, label: "Labrador Retriever", value: "LABRADOR_RETRIEVER" },
    { key: 49, label: "Lhasa Apso", value: "LHASA_APSO" },
    { key: 50, label: "Maltese", value: "MALTESE" },
    { key: 51, label: "Mastiff", value: "MASTIFF" },
    { key: 52, label: "Miniature Schnauzer", value: "MINIATURE_SCHNAUZER" },
    { key: 53, label: "Newfoundland", value: "NEWFOUNDLAND" },
    { key: 54, label: "Norwegian Elkhound", value: "NORWEGIAN_ELKHOUND" },
    { key: 55, label: "Papillon", value: "PAPILLON" },
    { key: 56, label: "Pekingese", value: "PEKINGESE" },
    { key: 57, label: "Pembroke Welsh Corgi", value: "PEMBROKE_WELSH_CORGI" },
    { key: 58, label: "Pit Bull", value: "PIT_BULL" },
    { key: 59, label: "Pointer", value: "POINTER" },
    { key: 60, label: "Pomeranian", value: "POMERANIAN" },
    { key: 61, label: "Poodle", value: "POODLE" },
    { key: 62, label: "Portuguese Water Dog", value: "PORTUGUESE_WATER_DOG" },
    { key: 63, label: "Pug", value: "PUG" },
    { key: 64, label: "Rottweiler", value: "ROTTWEILER" },
    { key: 65, label: "Saint Bernard", value: "SAINT_BERNARD" },
    { key: 66, label: "Samoyed", value: "SAMOYED" },
    { key: 67, label: "Schipperke", value: "SCHIPPERKE" },
    { key: 68, label: "Scottish Terrier", value: "SCOTTISH_TERRIER" },
    { key: 69, label: "Shetland Sheepdog", value: "SHETLAND_SHEEPDOG" },
    { key: 70, label: "Shih Tzu", value: "SHIH_TZU" },
    { key: 71, label: "Siberian Husky", value: "SIBERIAN_HUSKY" },
    { key: 72, label: "Staffordshire Bull Terrier", value: "STAFFORDSHIRE_BULL_TERRIER" },
    { key: 73, label: "Standard Schnauzer", value: "STANDARD_SCHNAUZER" },
    { key: 74, label: "Tibetan Terrier", value: "TIBETAN_TERRIER" },
    { key: 75, label: "Toy Poodle", value: "TOY_POODLE" },
    { key: 76, label: "Vizsla", value: "VIZSLA" },
    { key: 77, label: "Weimaraner", value: "WEIMARANER" },
    { key: 78, label: "Welsh Terrier", value: "WELSH_TERRIER" },
    { key: 79, label: "West Highland White Terrier", value: "WEST_HIGHLAND_WHITE_TERRIER" },
    { key: 80, label: "Whippet", value: "WHIPPET" },
    { key: 81, label: "Yorkshire Terrier", value: "YORKSHIRE_TERRIER" },
    { key: 82, label: "Mixed", value: "MIXED"},
    { key: 83, label: "Other", value: "OTHER" }
];
