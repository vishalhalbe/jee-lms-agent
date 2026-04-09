import type { Prediction } from "@/lib/dal/types"

export const MOCK_PREDICTIONS: Prediction[] = [
  {
    id: 1,
    examCycle: "JEE Mains 2026 Jan",
    subject: "Physics",
    topics: [
      {
        topic: "Electromagnetic Induction",
        confidence: 92,
        reasoning:
          "Asked in 8 of last 10 JEE Mains papers. High repeat frequency with rotating coil problems.",
      },
      {
        topic: "Modern Physics – Photoelectric Effect",
        confidence: 88,
        reasoning:
          "Consistently appears every year. Expect numerical on threshold wavelength.",
      },
      {
        topic: "Current Electricity – Wheatstone Bridge",
        confidence: 85,
        reasoning:
          "Gap of 2 years since last appearance suggests high probability.",
      },
      {
        topic: "Thermodynamics – Carnot Cycle",
        confidence: 79,
        reasoning:
          "Alternates with kinetic theory. Last year was kinetic theory.",
      },
      {
        topic: "Wave Optics – YDSE",
        confidence: 76,
        reasoning: "Young's double slit appears almost every session.",
      },
    ],
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: 2,
    examCycle: "JEE Mains 2026 Jan",
    subject: "Chemistry",
    topics: [
      {
        topic: "Coordination Compounds – Isomerism",
        confidence: 91,
        reasoning:
          "2-3 questions per paper consistently for last 5 years.",
      },
      {
        topic: "p-Block Elements – Group 17",
        confidence: 86,
        reasoning:
          "Halogens interhalogen compounds pattern detected in recent papers.",
      },
      {
        topic: "Electrochemistry – Nernst Equation",
        confidence: 83,
        reasoning: "Numericals on cell potential are a JEE staple.",
      },
      {
        topic: "Organic – Named Reactions",
        confidence: 80,
        reasoning:
          "Aldol, Cannizzaro, Reimer-Tiemann asked in rotation.",
      },
      {
        topic: "Chemical Kinetics – Rate Law",
        confidence: 74,
        reasoning:
          "Order determination numericals appear every 2 sessions.",
      },
    ],
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: 3,
    examCycle: "JEE Mains 2026 Jan",
    subject: "Mathematics",
    topics: [
      {
        topic: "Definite Integration – King Property",
        confidence: 94,
        reasoning:
          "King property questions appear in almost every paper. High confidence.",
      },
      {
        topic: "Complex Numbers – Argument & Rotation",
        confidence: 87,
        reasoning:
          "Geometry on Argand plane is a frequent JEE Advanced export to Mains.",
      },
      {
        topic: "3D Geometry – Line & Plane",
        confidence: 84,
        reasoning: "Distance and angle problems consistently appear.",
      },
      {
        topic: "Probability – Conditional",
        confidence: 81,
        reasoning:
          "Bayes theorem and conditional probability numerical trend detected.",
      },
      {
        topic: "Matrices – Eigenvalues",
        confidence: 72,
        reasoning:
          "Characteristic equation problems gaining frequency in recent sessions.",
      },
    ],
    createdAt: "2026-04-01T00:00:00Z",
  },
]
