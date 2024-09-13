"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";

const characters = [
  "abrams",
  "bebop",
  "dynamo",
  "grey talon",
  "haze",
  "infernus",
  "ivy",
  "kelvin",
  "lady geist",
  "lash",
  "mcginnis",
  "mo krill",
  "paradox",
  "pocket",
  "seven",
  "shiv",
  "vindicta",
  "viscous",
  "warden",
  "wraith",
  "yamato",
];

const DraftPick = () => {
  const [amberTeam, setAmberTeam] = useState<string[]>([]);
  const [sapphireTeam, setSapphireTeam] = useState<string[]>([]);
  const [currentTeam, setCurrentTeam] = useState<string>("Amber");
  const [availableCharacters, setAvailableCharacters] = useState<string[]>([
    ...characters,
  ]);
  const [draftEnded, setDraftEnded] = useState(false);

  const handlePick = (character: string) => {
    if (currentTeam === "Amber") {
      setAmberTeam([...amberTeam, character]);
      setCurrentTeam("Sapphire");
    } else {
      setSapphireTeam([...sapphireTeam, character]);
      setCurrentTeam("Amber");
    }

    setAvailableCharacters(availableCharacters.filter((c) => c !== character));

    if (amberTeam.length + sapphireTeam.length + 1 === 12) {
      setDraftEnded(true);
    }
  };

  const reset = () => {
    setAmberTeam([]);
    setSapphireTeam([]);
    setCurrentTeam("Amber");
    setAvailableCharacters(characters);
    setDraftEnded(false);
  };

  return (
    <div className="p-4">
      <div className="flex flex-row">
        <h1 className="text-2xl font-bold mb-4">Deadlock Draft Pick</h1>{" "}
        <Button onClick={reset} className="ml-4 text-xl font-semibold" style={{backgroundColor: 'red'}}>
          reset
        </Button>
      </div>
      <div className="flex justify-between mb-4 gap-4">
        <Card className="w-1/2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Amber</h2>
          </CardHeader>
          <CardContent>
            <ul>
              {amberTeam.map((character, index) => (
                <li key={index}>{character}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="w-1/2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Sapphire</h2>
          </CardHeader>
          <CardContent>
            <ul>
              {sapphireTeam.map((character, index) => (
                <li key={index}>{character}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      {!draftEnded ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {currentTeam}s turn to pick
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10  gap-4 justify-items-center">
            {availableCharacters.map((character) => (
              <div
                onClick={() => handlePick(character)}
                style={{ borderColor: "white", borderWidth: 2 }}
                key={character}
              >
                <CardHeader>{character}</CardHeader>
                <Image
                  src={`./images/${character}.webp`}
                  width={150}
                  height={150}
                  alt={character}
                />
              </div>

            ))}
          </div>
        </div>
      ) : (
        <h2 className="text-xl font-semibold self-center">Draft has ended!</h2>
      )}
    </div>
  );
};

export default DraftPick;
