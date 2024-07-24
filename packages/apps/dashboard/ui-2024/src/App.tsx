import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@pages/Home';
import Graph from '@pages/Graph';
import SearchResults from '@pages/SearchResults';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		mutations: { retry: 0 },
		queries: { retry: 0 },
	},
});

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/graph" element={<Graph />} />
					<Route path="/search/:chainId/:address" element={<SearchResults />} />
					<Route path="*" element={<div>Not find</div>} />
				</Routes>
			</Router>
		</QueryClientProvider>
	);
};

export default App;
