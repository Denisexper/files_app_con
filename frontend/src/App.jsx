import { useState } from 'react'
import './App.css'

const APP_STATUS = {
  IDLE: 'idle', // al entrar 
  ERROR: 'error', // cuando hay un error
  READY_UPLOAD: 'ready_upload', // al elegir el archivo y antes de subir
  UPLOADING: 'uploading', // meintras se sube
  READY_USAGE: 'ready_usage', // despues de subir
}

function App() {
  const [appStatus, setAppStatus] = useState(APP_STATUS.IDLE)
  const [file, setFile] = useState(null)

  const handleInputChange = (event) => {
    const [file] = event.target.files ?? []
    if(file) {
      setFile(file)
      setAppStatus(APP_STATUS.READY_UPLOAD)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('TODO')
  }


  return (
    <>
      <h4> Challenge: Upload CSV + Searach</h4>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            onChange={handleInputChange}
            name='file'
            type='file'
            accept='.csv'
          />
        </label>

        {appStatus === APP_STATUS.READY_UPLOAD && (<button>
          Subir archivo
        </button>
        )}
      </form>
    </>
  )
}

export default App
