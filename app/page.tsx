"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const characters = [
  "abrams", "bebop", "dynamo", "grey talon", "haze", "infernus", "ivy", "kelvin",
  "lady geist", "lash", "mcginnis", "mo krill", "paradox", "pocket", "seven",
  "shiv", "vindicta", "viscous", "warden", "wraith", "yamato"
];

type Team = "Amber" | "Sapphire";

interface DraftState {
  amberTeam: string[];
  sapphireTeam: string[];
  currentTeam: Team;
  availableCharacters: string[];
  bannedCharacters: string[];
  banMode: boolean;
}

const DraftPick: React.FC = () => {
  const [draftStates, setDraftStates] = useState<DraftState[]>([{
    amberTeam: [],
    sapphireTeam: [],
    currentTeam: "Amber",
    availableCharacters: [...characters],
    bannedCharacters: [],
    banMode: false
  }]);
  const [isCopied, setIsCopied] = useState(false);

  const currentState = draftStates[draftStates.length - 1];
  const { amberTeam, sapphireTeam, currentTeam, availableCharacters, bannedCharacters, banMode } = currentState;

  const draftEnded = sapphireTeam.length + amberTeam.length === 12;

  const updateDraftState = useCallback((updater: (prevState: DraftState) => DraftState) => {
    setDraftStates(prevStates => [...prevStates, updater(prevStates[prevStates.length - 1])]);
  }, []);

  const handlePick = useCallback((character: string) => {
    updateDraftState(prevState => ({
      ...prevState,
      [banMode ? 'bannedCharacters' : `${currentTeam.toLowerCase()}Team`]: [
        ...prevState[banMode ? 'bannedCharacters' : `${currentTeam.toLowerCase()}Team` as keyof DraftState] as string[],
        character
      ],
      currentTeam: prevState.currentTeam === "Amber" ? "Sapphire" : "Amber",
      availableCharacters: prevState.availableCharacters.filter(c => c !== character)
    }));
  }, [banMode, currentTeam, updateDraftState]);

  const toggleBanMode = useCallback(() => {
    updateDraftState(prevState => ({ ...prevState, banMode: !prevState.banMode }));
  }, [updateDraftState]);

  const reset = useCallback(() => {
    setDraftStates([{
      amberTeam: [],
      sapphireTeam: [],
      currentTeam: "Amber",
      availableCharacters: [...characters],
      bannedCharacters: [],
      banMode: false
    }]);
    setIsCopied(false);
  }, []);

  const undo = useCallback(() => {
    if (draftStates.length > 1) {
      setDraftStates(prevStates => prevStates.slice(0, -1));
      setIsCopied(false);
    }
  }, [draftStates.length]);

  const copyResults = useCallback(() => {
    const results = `
Deadlock Draft Results:

Amber Team:
${amberTeam.join(", ")}

Sapphire Team:
${sapphireTeam.join(", ")}

Banned Characters:
${bannedCharacters.length > 0 ? bannedCharacters.join(", ") : "None"}
    `.trim();

    navigator.clipboard.writeText(results).then(() => {
      setIsCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Draft results have been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy failed",
        description: "Failed to copy results to clipboard. Please try again.",
        variant: "destructive",
      });
    });
  }, [amberTeam, sapphireTeam, bannedCharacters]);

  const renderTeam = useCallback((team: Team) => (
    <Card className="w-full bg-gradient-to-br from-slate-800 to-slate-900 border-none shadow-lg">
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-bold text-center text-white">{team}</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {(team === "Amber" ? amberTeam : sapphireTeam).map((character, index) => (
            <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
              {character}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  ), [amberTeam, sapphireTeam]);

  const renderCharacterGrid = useCallback((characters: string[], onClick?: (character: string) => void) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center">
      {characters.map((character) => (
        <div
          onClick={() => onClick && onClick(character)}
          className={`relative group ${onClick ? 'cursor-pointer' : ''} transition-transform duration-200 ease-in-out transform hover:scale-105`}
          key={character}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-70 transition-opacity duration-200 flex items-end justify-center">
            <span className="text-white text-lg font-semibold pb-2">{character}</span>
          </div>
          <Image
            src={`./images/${character}.webp`}
            width={150}
            height={150}
            alt={character}
            className="rounded-lg shadow-md"
          />
        </div>
      ))}
    </div>
  ), []);

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-slate-900 min-h-screen text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Deadlock Draft Pick
        </h1>
        <div className="space-x-2">
          <Button onClick={undo} variant="outline" size="sm" disabled={draftStates.length <= 1}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Undo
          </Button>
          <Button onClick={reset} variant="destructive" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {renderTeam("Amber")}
        {renderTeam("Sapphire")}
      </div>

      {!draftEnded ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold mb-2 sm:mb-0">
              {currentTeam}s turn to {banMode ? 'ban' : 'pick'}
            </h2>
            <Button
              onClick={toggleBanMode}
              variant={banMode ? "destructive" : "default"}
              className="w-full sm:w-auto"
            >
              {banMode ? "Switch to Pick Mode" : "Switch to Ban Mode"}
            </Button>
          </div>

          <Tabs defaultValue="available" className="mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="available" className="data-[state=active]:bg-slate-700">Available Characters</TabsTrigger>
              <TabsTrigger value="banned" className="data-[state=active]:bg-slate-700">Banned Characters</TabsTrigger>
            </TabsList>
            <TabsContent value="available" className="mt-4">
              {renderCharacterGrid(availableCharacters, handlePick)}
            </TabsContent>
            <TabsContent value="banned" className="mt-4">
              {renderCharacterGrid(bannedCharacters)}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <Card className="bg-gradient-to-br from-green-500 to-emerald-700 border-none shadow-lg p-6 text-center mb-6">
            <h2 className="text-3xl font-bold text-white">Draft has ended</h2>
            <p className="text-white mt-2">Good luck have fun!</p>
          </Card>

          <Button 
            onClick={copyResults} 
            variant="outline" 
            size="lg" 
            className="w-full mb-6"
          >
            {isCopied ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> Copy Results
              </>
            )}
          </Button>

          {bannedCharacters.length > 0 && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4">Banned Characters</h3>
              {renderCharacterGrid(bannedCharacters)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DraftPick;