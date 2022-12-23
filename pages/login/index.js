import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import Image from 'next/image'
import { useRouter, withRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../components/firebase/context'
import styles from '../../styles/Login.module.scss'

// TODO: refresh token
function Login({ router, ...props }) {
  const authContext = useContext(AuthContext)

  useEffect(() => {
    authContext.isUserAuthenticated() && router.push('/movies')
  }, [])

  const [email, setEmail] = useState(
    router && router.query && router.query.email ? router.query.email : ''
  )
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)

  const changeEmail = (userEmail) => {
    userEmail === null ? setEmail('') : setEmail(userEmail)
  }

  const changePassword = (userPassword) => {
    userPassword === null ? setPassword('') : setPassword(userPassword)
  }

  const signInWithEmail = async () => {
    try {
      const authProvider = getAuth()
      const authRes = await signInWithEmailAndPassword(
        authProvider,
        email,
        password
      )
      setWrongPassword(false)

      const userRes = await fetch(
        `http://localhost:8080/api/v1/user-by-email?email=${email}`
      )

      const user = await userRes.json()
      authContext.setUserAuthInfo(authRes.user, authRes._tokenResponse, user)
    } catch (err) {
      console.error('signInWithEmail error', err.code)
      if (err.code == 'auth/wrong-password') setWrongPassword(true)
    }
  }

  return (
    <div className={styles.fullContent}>
      <div className={styles.logo}>
        REALLY <br />
        NICE <br />
        LOGO
      </div>
      <div className={styles.blackCenter}>
        <strong className={styles.signInText}>Login</strong>
        <div className={styles.center}>
          <div className={styles.fullInput}>
            <input
              type="email"
              value={email}
              onChange={(e) => changeEmail(e.target.value)}
              placeholder="E-MAIL"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => changePassword(e.target.value)}
              placeholder="SENHA"
            />
          </div>
          <button onClick={(e) => signInWithEmail()}>ENTRAR</button>
          {wrongPassword && (
            <div className={styles.wrong}>
              <Image
                src={'/thinking-emoji.png'}
                alte={'thinking emoji'}
                width={80}
                height={80}
              />
              <p>Senha incorreta!</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.shining}></div>
    </div>
  )
}

export default withRouter(Login)
