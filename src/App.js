import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {Link, Route} from "react-router-dom";
import Welcome from "./Welcome";

function App() {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [errors,setErrors] = useState('')
  const [isLoading,setLoader] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
      setLoader(true)
      const isLogged = localStorage.getItem('isLogged')
      if(isLogged?.length > 0){
          setLoader(true)
          autoLogin()
          setLoader(false)
      }
  },[])

  const autoLogin = async () => {
      const response = await axios.post(
          'https://dev-api.thexplace.ai/api/auth/auto-login',
          {},{
              headers: {
                  'authorization': 'Bearer ' + localStorage.getItem('isLogged')
              },
          }
      )

      dispatch({
          type : 'SUCCESS',
          data : response.data.user
      })
  }

  const handleSubmit = async (e) => {
        try{
            setErrors('')
            e.preventDefault()

            const response = await axios.post(
                'https://dev-api.thexplace.ai/api/auth/login',
                {
                    email : email,
                    password : password,
                },{
                    headers: {
                        'accept': 'application/json'
                    },
                }
            )

            localStorage.setItem('isLogged', response.data.accessToken)

            dispatch({
                type : 'SUCCESS',
                data : response.data.user
            })

        }catch (e){
            setErrors(e.response.data.message)
            localStorage.setItem('isLogged', '')
            dispatch({
                type : 'FAIL',
            })
        }

  }

  const logOut = () => {
      localStorage.setItem('isLogged', '')
      dispatch({
          type : 'FAIL',
      })
      setLoader(true)
  }

  return (
      <>
          <Link to="/">Main Page</Link>
          <br/>
          <Link to="/welcome">Welcome Page</Link>
          <br/>
          <button onClick={() => logOut()}>Log Out</button>
          <h3>{user?.email}</h3>
          <h3>{user?.firstName}</h3>
          <br/>


          <Route exact path="/">
              {Object.keys(user).length === 0 && isLoading &&
                  <form method="POST" onSubmit={handleSubmit}>
                      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                      <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                      <button type="submit">Login</button>
                      <br/>
                      {JSON.stringify(errors)}
                  </form>
              }
          </Route>
          <Route exact path="/welcome" component={Welcome} />
      </>
  );
}

export default App;
