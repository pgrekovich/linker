import LoginForm from './components/LoginForm'
import LinkCreationForm from './components/LinkCreationForm'
import { useCookies } from 'react-cookie'

const App = () => {
  const [cookies] = useCookies(['token'])
  const isAuthenticated = !!cookies.token

  return <div>{isAuthenticated ? <LinkCreationForm /> : <LoginForm />}</div>
}

export default App
