import React, { useState } from "react";
import {
  Input,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Paper
} from "@mui/material";
import { Close, FmdGood, Search } from "@mui/icons-material";
import styled from "@emotion/styled";
import { usePlacesWidget } from "react-google-autocomplete";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { useRouter } from "next/router";

const SearchBox = styled(Autocomplete)(() => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "10px",
      borderColor: "#696969",
      borderWidth: "0.7px"
    },
    "&:hover fieldset": {
      borderColor: "#696969",
      borderWidth: "0.7px"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#696969",
      borderWidth: "0.7px"
    }
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#696969",
    borderWidth: "0.7px"
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#15383D",
    borderWidth: "0.7px"
  }
}));

const Map = () => {
  const [value, setValue] = useState("");
  const [country, setCountry] = useState("in");
  const [city, setCity] = useState("");
  const [cordinates, setCordinates] = useState({ lat: "", lng: "" });
  //   const handlePlaceSelect = (place) => {
  //     console.log(place);
  //     setCordinates({
  //       lat: place.geometry.location?.lat(),
  //       lng: place.geometry.location?.lng(),
  //     });
  //     setCity(place.formatted_address);
  //   };
  //   const { ref: materialRef } = usePlacesWidget({
  //     apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
  //     onPlaceSelected: handlePlaceSelect,
  //     inputAutocompleteValue: "kochi",
  //     options: {
  //       types: [],
  //       componentRestrictions: { country },
  //     },
  //   });
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading
  } = useGoogle({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    options: {
      types: [],
      componentRestrictions: { country }
    },
    debounce: 300
  });

  return (
    <div>
      <div style={{ width: "250px", marginTop: "20px" }}>
        <span style={{ color: "black" }}>{city}</span>
        <span style={{ color: "black" }}>{cordinates.lat}</span>
        <span style={{ color: "black" }}>{cordinates.lng}</span>
        {/* <TextField
          fullWidth
          color="secondary"
          variant="outlined"
          inputRef={materialRef}
        /> */}
        <SearchBox
          aria-required
          freeSolo
          size={"medium"}
          fullWidth
          id="combo-box-demo"
          //   options={searchBarOptions}
          options={placePredictions}
          getOptionLabel={(option) => {
            // iff option.description is undefined then return first element of placePredictions
            return (
              option?.description || placePredictions[0]?.description || ""
            );
          }}
          PaperComponent={({ children }) => (
            <Paper
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                maxWidth: "100%",
                marginTop: 1.5
              }}
            >
              {children}
            </Paper>
          )}
          renderOption={(props, option) => {
            return (
              <li
                {...props}
                style={{ ...props.style, borderBottom: "1px solid #eee" }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <Box
                    sx={{
                      color: "#107382",
                      fontSize: "1rem",
                      "@media (max-width: 600px)": {
                        fontSize: "0.8rem",
                        margin: 0
                      }
                    }}
                  >
                    {option.description}
                  </Box>
                </div>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={"Enter Location"}
              //   error={error.length > 0}
              // helperText={error}

              //   value={searchData?.place_name ? searchData.place_name : ""}
              value={value}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isPlacePredictionsLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <FmdGood />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="info"
                      sx={{
                        m: 0,
                        height: "100%",
                        width: true ? 60 : 80,
                        position: "absolute",
                        right: 0,
                        top: 0,
                        borderRadius: true ? "10px" : "10px"
                      }}
                      //   onClick={() => {
                      //     if (searchData?.place_name?.length > 0) {
                      //       if (home) {
                      //         setSearchModal(true);
                      //         setError("");
                      //       } else if (propertyPage) {
                      //         localStorage.setItem(
                      //           "filter",
                      //           JSON.stringify({
                      //             ...JSON.parse(localStorage.getItem("filter")),
                      //             ...searchData,
                      //           })
                      //         );
                      //         router.push({
                      //           pathname: "/property",
                      //           query: { ...searchData, type: router.query.type },
                      //         });
                      //       }
                      //     } else {
                      //       setError("Please select a location");
                      //     }
                      //   }}
                    >
                      <Search />
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          )}
          // onInputChange={(event, newInputValue) => {
          //   fetchLocationOptions(newInputValue);
          // }}
          onChange={(event, newValue) => {
            if (newValue) {
              setCity(newValue.description);
              placesService?.getDetails(
                {
                  placeId: newValue.place_id,
                  // add more fields here as needed
                  fields: ["geometry"]
                },
                (placeDetails) => {
                  // get long and lat here
                  setCordinates({
                    lat: placeDetails.geometry.location.lat(),
                    lng: placeDetails.geometry.location.lng()
                  });
                }
              );
            }
          }}
          onInputChange={(evt) => {
            // if last character is enter then return
            getPlacePredictions({ input: evt.target.value });
            setValue(evt.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              let newValue = placePredictions?.[0];
              if (newValue) {
                placesService?.getDetails(
                  {
                    placeId: newValue.place_id,
                    fields: ["geometry"]
                  },
                  (placeDetails) => {
                    setCity(newValue.description);
                    setCordinates({
                      lat: placeDetails.geometry.location.lat(),
                      lng: placeDetails.geometry.location.lng()
                    });
                  }
                );
              }
            }
          }}
          InputLabelProps={{ shrink: false }}
          sx={{
            // maxWidth: "500px",
            width: "250px",
            display: "flex",
            mx: "auto",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                display: "flex",
                height: "auto",
                borderRadius: true ? "10px" : "20px",
                borderWidth: true ? "2px" : "0.7px"
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Map;
