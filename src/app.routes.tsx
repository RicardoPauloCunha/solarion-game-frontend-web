import { useEffect } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { useAuthContext } from "./hooks/contexts/auth"
import { getTokenStorage } from "./hooks/storage/token"
import Home from "./pages/Home"
import Login from "./pages/Login"
import MyScores from "./pages/MyScores"
import Profile from "./pages/Profile"
import RecoverPassword from "./pages/RecoverPassword"
import RegisterAccount from "./pages/RegisterAccount"
import Scores from "./pages/Scores"
import { DefaultRoutePathEnum } from "./types/enums/routePath"
import { UserTypeEnum } from "./types/enums/userType"
import NotFound from "./pages/NotFound"
import Scenario from "./pages/Scenario"
import DecisionsRating from "./pages/DecisionsRating"

const AppRoutes = () => {
	const location = useLocation()

	const {
		loggedUser,
		defineLoggedUserByToken
	} = useAuthContext()

	useEffect(() => {
		let token = getTokenStorage()

		if (token)
			defineLoggedUserByToken(token)
	}, [])

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location?.pathname])

	return (
		<Routes>
			<Route path="*" element={<NotFound />} />
			<Route path={DefaultRoutePathEnum.NotFound} element={<NotFound />} />

			<Route path={DefaultRoutePathEnum.Home} element={<Home />} />
			<Route path={DefaultRoutePathEnum.Login} element={<Login />} />
			<Route path={DefaultRoutePathEnum.RegisterAccount} element={<RegisterAccount />} />
			<Route path={DefaultRoutePathEnum.RecoverPassword} element={<RecoverPassword />} />
			<Route path={DefaultRoutePathEnum.Scenario} element={<Scenario />} />
			<Route path={DefaultRoutePathEnum.DecisionsRating} element={<DecisionsRating />} />

			{loggedUser && <>
				<Route path={DefaultRoutePathEnum.Profile} element={<Profile />} />
			</>}

			{loggedUser?.userType === UserTypeEnum.Common && <>
				<Route path={DefaultRoutePathEnum.MyScores} element={<MyScores />} />
			</>}

			{loggedUser?.userType === UserTypeEnum.Admin && <>
				<Route path={DefaultRoutePathEnum.Scores} element={<Scores />} />
			</>}
		</Routes>
	)
}

export default AppRoutes