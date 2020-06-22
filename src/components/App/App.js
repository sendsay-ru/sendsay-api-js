import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom'
import './App.css'
import Header from '../Header'
import HistoryPanel from '../HistoryPanel/HistoryPanel'
import RequestResponse from '../RequestResponse'
import ActionPanels from '../ActionPanels'
import AuthorizationForm from '../AuthorizationForm'
import NotFound from '../NotFound'


function App() {
	const isLogged = useSelector(store => store.app.isLogged)

	return (
		<div className="App">
			<Switch>
				<Route exact path="/">
					{isLogged ? <Redirect to="/main" /> : <AuthorizationForm />}
				</Route>

				<Route path="/main">
					{isLogged ?
						<>
							<Header />
							<HistoryPanel />
							<RequestResponse />
							<ActionPanels />
						</> : <Redirect to="/" />
					}
				</Route>

				<Route path="*">
					<NotFound />
				</Route>

			</Switch>
		</div>
	)
}

export default App