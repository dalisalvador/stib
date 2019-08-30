import React from 'react';

const AllLinesContext = React.createContext(true);

export const AllLinesProvider = AllLinesContext.Provider;
export const AllLinesConsumer = AllLinesContext.Consumer;
export default AllLinesContext;
