import { CalendarModel } from "@domain/calendar/model/calendarModel";
import { createRepresentation as createCalendarRepresentation } from "@domain/calendar/representation/hooks";
import { MeasureModel } from "@domain/measure/model/measureModel";
import { createRepresentation as createMeasureRepresentation } from "@domain/measure/representation/hooks";
import React, { createContext, useContext } from "react";
import { apiService } from "./services";

const measureModel = new MeasureModel();
const calendarModel = new CalendarModel();

const calendar = createCalendarRepresentation(apiService, calendarModel);
const measure = createMeasureRepresentation(apiService, measureModel);

const representations = {
	calendar,
	measure,
};

export type Representations = typeof representations;
export const RepresentationsContext = createContext<Representations | null>(null);
export const RepresentationsProvider: React.FC = ({ children }) => {
	return <RepresentationsContext.Provider value={representations}>{children}</RepresentationsContext.Provider>;
};

export function useRepresentations(): Representations {
	const representations = useContext(RepresentationsContext);
	if (!representations) {
		throw Error("ServiceContext not defined");
	}
	return representations;
}
