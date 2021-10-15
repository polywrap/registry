import React from "react";
import { Logger } from "winston";

export const LoggerContext = React.createContext<Logger | undefined>(undefined);
