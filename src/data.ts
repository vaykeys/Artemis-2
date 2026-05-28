import { Astronaut, FlightPhase, SpacecraftPart } from "./types.ts";

export const ASTRONAUTS: Astronaut[] = [
  {
    id: "wiseman",
    name: "Reid Wiseman",
    role: "Mission Commander",
    agency: "NASA",
    country: "United States",
    bio: "A decorated U.S. Navy Captain and seasoned naval aviator, Reid commanded the Expedition 41 crew on the International Space Station, logging 165 days in space with 24 hours of spacewalks.",
    funFact: "Wiseman is known and loved for his extensive photography, bringing the beauty of space down to Earth from his ISS mission via social media.",
    extendedBio: [
      "Born in Baltimore, Maryland, Reid joined NASA in 2009 as an astronaut candidate.",
      "As Commander of Artemis II, Wiseman will lead the four-person crew on their historic trip around the Moon, verifying the critical piloting, safety, and commander structures of the spacecraft.",
      "He previously served as Chief of the Astronaut Office from 2020 to 2022, managing flight crew assignments and operations."
    ],
    imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=400" // artistic placeholder of rocket/helmet launcher
  },
  {
    id: "glover",
    name: "Victor Glover",
    role: "Mission Pilot",
    agency: "NASA",
    country: "United States",
    bio: "Victor Glover is a highly experienced Navy Captain who piloted SpaceX Crew-1 to the ISS in 2020. He has logged 168 days in orbit and performed four spacewalks.",
    funFact: "Glover will be the first African American astronaut sent on a lunar mission, continuing a legacy of breaking barriers in aerospace.",
    extendedBio: [
      "A native of Pomona, California, Victor holds degrees on Flight Test Engineering and Space Systems.",
      "As the pilot of Artemis II, Glover is tasked with maintaining flight controls, system parameters, and manual rendezvous simulations of the Orion capsule.",
      "Glover carries a high passion for fitness and public outreach, inspiring school groups worldwide with the excitement of heavy lift flight."
    ],
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "koch",
    name: "Christina Koch",
    role: "Mission Specialist",
    agency: "NASA",
    country: "United States",
    bio: "An electrical engineer who famously set the world record for the single longest spaceflight by a woman (328 days), Christina has performed six spacewalks on her primary mission.",
    funFact: "Koch participated in all three historic, first-ever all-female spacewalks and holds extensive experience conducting Antarctic research.",
    extendedBio: [
      "Raised in Jacksonville, North Carolina, Christina spent years working as a space scientist at various polar stations.",
      "As Mission Specialist 1, Koch's primary role includes monitoring life-support networks and cargo bay telemetry while managing scientific payload objectives.",
      "Her deep-space experience will guide human systems verification, ensuring thermal controls protect the crew through high radiation transits."
    ],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "hansen",
    name: "Jeremy Hansen",
    role: "Mission Specialist",
    agency: "CSA",
    country: "Canada",
    bio: "Jeremy Hansen is an exceptional Canadian Space Agency astronaut and former CF-18 fighter pilot. Born in London, Ontario, he has coordinated astronaut training for both CSA and NASA.",
    funFact: "Hansen will become the first Canadian astronaut to ever journey into deep space and fly around the Moon as part of an international coalition.",
    extendedBio: [
      "Jeremy represented Canada by leading NASA’s astronaut class in 2017—the first Canadian chosen to head a joint training group.",
      "On Artemis II, he acts as Mission Specialist 2, operating in lockstep with the crew to validate communications with Deep Space Network tracking stations.",
      "His selection represents the robust aerospace partnership of Canada, which is contributing the state-of-the-art Canadarm3 to the future lunar Gateway."
    ],
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=400"
  }
];

export const FLIGHT_PHASES: FlightPhase[] = [
  {
    id: "launch",
    phaseNumber: 1,
    title: "Launch & Ascent",
    duration: "8.5 Minutes",
    altitudeRange: "0 to 160 km",
    description: "The 322-foot-tall Space Launch System (SLS) rocket lifts off from Pad 39B at Kennedy Space Center with 8.8 million lbs of thrust, separating its Solid Rocket Boosters and Core Stage.",
    keyAction: "Core Stage cutoff and initial insertion into an elliptical low Earth orbit safely."
  },
  {
    id: "systems-check",
    phaseNumber: 2,
    title: "High Earth Orbit Test",
    duration: "24 Hours",
    altitudeRange: "Up to 74,000 km",
    description: "To thoroughly test the Orion capsule's complex life-support, communication, and environmental controls before committing to deep space, the crew orbits Earth for 24 hours.",
    keyAction: "Manual transition and maneuvering flight tests to lock and verify flight handling capabilities."
  },
  {
    id: "tli",
    phaseNumber: 3,
    title: "Trans-Lunar Injection",
    duration: "20 Minutes Burn",
    altitudeRange: "Translating to Deep Space",
    description: "The ICPS booster fires to generate immense speed (over 24,500 mph) to break free from Earth's gravity and set Orion on a precise trajectory toward the Moon.",
    keyAction: "Engine burn initiates a hybrid free-return trajectory that secures a safe passive loop back to Earth."
  },
  {
    id: "outbound",
    phaseNumber: 4,
    title: "Outbound Transit",
    duration: "4 Days",
    altitudeRange: "384,400 km Trip",
    description: "The crew cruises toward their destination, adjusting course with the European Service Module and conducting stellar navigation checks, exercise routines, and science.",
    keyAction: "Monitoring solar activity, thermal rotation (rotational passive thermal control) and deep-space cabin noise."
  },
  {
    id: "lunar-reach",
    phaseNumber: 5,
    title: "Lunar Flyby Loop",
    duration: "Approx. 24 Hours",
    altitudeRange: "7,400 km past Lunar Farside",
    description: "Artemis II flies past the lunar far side, using Moon's gravity to whip around without spending valuable fuel. The crew catches breathtaking, close-range sights of lunar craters.",
    keyAction: "Historical communications blackout while behind the Moon, observing lunar target features for potential future landings."
  },
  {
    id: "return",
    phaseNumber: 6,
    title: "Homeward Bound",
    duration: "4 Days",
    altitudeRange: "Return Transit",
    description: "Pulled back by Earth's gravity, Orion accelerates back home, utilizing small thruster adjustments while scientists prepare recovery vessels in the Pacific.",
    keyAction: "Preparation for crew cabin staging and mechanical release of the European Service Module."
  },
  {
    id: "splashdown",
    phaseNumber: 7,
    title: "Atmospheric Entry & Splashdown",
    duration: "30 Minutes",
    altitudeRange: "120 km to Splashdown",
    description: "The crew module separates from the service module, hits gravity at 25,000 mph, survives a scorching 5,000°F re-entry heat, and floats down on three huge parachutes near San Diego.",
    keyAction: "Immediate extraction by joint Navy and NASA recovery helicopters and secure medical checks."
  }
];

export const SPACECRAFT_PARTS: SpacecraftPart[] = [
  {
    id: "orion",
    name: "Orion Crew Module",
    description: "The principal habitat capsule for the four astronauts. Made of high-grade aluminum-lithium alloy with titanium bulkheads, designed to sustain life for 21 days solo.",
    specifications: [
      { label: "Diameter", value: "16.5 Feet (5.02 meters)" },
      { label: "Pressurized Volume", value: "695 Cubic Feet (19.6 m³)" },
      { label: "Primary Shielding", value: "Avcoat Ablative Heat Shield" },
      { label: "Crew Capacity", value: "4 Astronauts (up to 10-day loop)" }
    ],
    highlight: "Equipped with redundant hybrid systems: fully upgraded avionics, solar wind shielding, and manual steering controllers for flight emergencies."
  },
  {
    id: "esm",
    name: "European Service Module (ESM)",
    description: "Provided by Airbus and ESA, the ESM is the powerhouse. Located below Orion, it delivers vital power, consumables, temperature regulation, and overall spacecraft propulsion.",
    specifications: [
      { label: "Solar Panels", value: "Four 62-foot wings generating 11 kW" },
      { label: "Propellant Capacity", value: "19,000 lbs (8,600 kg) fuel" },
      { label: "Engines", value: "1 Orbital Maneuvering System engine, 32 thrusters" },
      { label: "Life Support", value: "Provides nitrogen, oxygen, and drinking water" }
    ],
    highlight: "Includes crucial nitrogen/oxygen tanks that supply pressurization directly to Orion's cabin environment."
  },
  {
    id: "sls",
    name: "SLS Core Stage",
    description: "The giant center column of the launch vehicle, holding 733,000 gallons of supercooled liquid hydrogen and liquid oxygen. Constructed by Boeing in New Orleans.",
    specifications: [
      { label: "Height", value: "212 Feet (64.6 meters)" },
      { label: "Engines", value: "4 RS-25 liquid propellant engines" },
      { label: "Total Thrust", value: "2 million lbs (part of launch power)" },
      { label: "Material", value: "Al-2219 Friction Stir-Welded Alloy" }
    ],
    highlight: "Engines burned for exactly 480 seconds (8 minutes) before separation 100 miles above Earth."
  },
  {
    id: "boosters",
    name: "Solid Rocket Boosters (SRBs)",
    description: "Two matching tall white boosters strapped to the sides of the Core Stage, providing 75% of the total pad takeoff thrust during liftoff. Built by Northrop Grumman.",
    specifications: [
      { label: "Configuration", value: "5 solid fuel segments per booster" },
      { label: "Thrust", value: "3.6 million lbs force each (7.2M total)" },
      { label: "Burn Duration", value: "126 seconds (then separated)" },
      { label: "Fuel Type", value: "Polybutadiene Acrylonitrile (PBAN) solid" }
    ],
    highlight: "Separated cleanly and fell in the Atlantic Ocean, while SLS continued climbing with RS-25 core engines."
  },
  {
    id: "las",
    name: "Launch Abort System (LAS)",
    description: "An emergency tower perched on top of Orion. Designed to pull the crew capsule clear of the rocket in milliseconds if a major anomaly occurs on the launchpad or during initial ascent.",
    specifications: [
      { label: "Thrust Capacity", value: "400,000 lbs of active motor thrust" },
      { label: "Acceleration", value: "0 to 100 mph in under 2 seconds" },
      { label: "Motors Included", value: "Abort Motor, Attitude Control, Pitch Control" },
      { label: "Status during orbit", value: "Jettisoned at 300,000 feet orbit height" }
    ],
    highlight: "Safeguards the crew. If unused, it jettisons cleanly 3 minutes into launch flight to shed deadweight."
  }
];
