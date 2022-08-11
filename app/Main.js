import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

// Context
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// Custom Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";

function Main() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem("complexAppToken")),
		flashMessages: [],
		user: {
			token: localStorage.getItem("complexAppToken"),
			username: localStorage.getItem("complexAppUsername"),
			avatar: localStorage.getItem("complexAppAvatar"),
		},
		isSearchOpen: false,
	};

	function ourReducer(draft, action) {
		switch (action.type) {
			case "login":
				draft.loggedIn = true;
				draft.user = action.data;
				break;
			case "logout":
				draft.loggedIn = false;
				break;
			case "flashMessage":
				draft.flashMessages.push(action.value);
				break;
			case "openSearch":
				draft.isSearchOpen = true;
				break;
			case "closeSearch":
				draft.isSearchOpen = false;
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState);

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem("complexAppToken", state.user.token);
			localStorage.setItem("complexAppUsername", state.user.username);
			localStorage.setItem("complexAppAvatar", state.user.avatar);
		} else {
			localStorage.removeItem("complexAppToken");
			localStorage.removeItem("complexAppUsername");
			localStorage.removeItem("complexAppAvatar");
		}
	}, [state.loggedIn]);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages />
					<Header />
					<Routes>
						<Route path="/profile/:username" element={<Profile />} />
						<Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
						<Route path="/post/:id" element={<ViewSinglePost />} />
						<Route path="/post/:id/edit" element={<EditPost />} />
						<Route path="/create-post" element={<CreatePost />} />
						<Route path="/about-us" element={<About />} />
						<Route path="/terms" element={<Terms />} />
						{/* Must be last */}
						<Route path="*" element={<NotFound />} />
					</Routes>
					<CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
						<Search />
					</CSSTransition>
					<Footer />
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<Main />);

if (module.hot) {
	module.hot.accept();
}
