import React from "react";
import { Web3 } from "../types/Web3";

export const Web3Context = React.createContext<Web3 | undefined>(undefined);
