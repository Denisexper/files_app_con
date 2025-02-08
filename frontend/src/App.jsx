import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import './App.css'
import { uploadfile } from './services/upload.js'
import { Search } from './steps/Search.jsx'



const APP_STATUS = {
  IDLE: 'idle', // al entrar 
  ERROR: 'error', // cuando hay un error
  READY_UPLOAD: 'ready_upload', // al elegir el archivo y antes de subir
  UPLOADING: 'uploading', // meintras se sube
  READY_USAGE: 'ready_usage', // despues de subir
}

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: 'Subir Archivo',
  [APP_STATUS.UPLOADING]: 'Subiendo...'
}

function App() {
  const [appStatus, setAppStatus] = useState(APP_STATUS.IDLE)
  const [data, setData] = useState([])
  const [file, setFile] = useState(null)

  const handleInputChange = (event) => {
    const [file] = event.target.files ?? []
    if (file) {
      setFile(file)
      setAppStatus(APP_STATUS.READY_UPLOAD)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (appStatus != APP_STATUS.READY_UPLOAD || !file) {
      return
    }

    setAppStatus(APP_STATUS.UPLOADING)

    const [err, newData] = await uploadfile(file)
    console.log(newData)

    if (err) {
      setAppStatus(APP_STATUS.ERROR)
      toast.error(err.message)
      return
    }

    setAppStatus(APP_STATUS.READY_USAGE)
    if (newData) setData(newData)
    toast.success('Archivo subido correctamente')
  }


  const showButtton = appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING
  const showInput = appStatus !== APP_STATUS.READY_USAGE

  return (
    <>
      <Toaster />
      <h4> Challenge: Upload CSV + Searach</h4>

      {
        showInput && (
          <form onSubmit={handleSubmit}>
            <label>
              <input
                disabled={appStatus === APP_STATUS.UPLOADING}
                onChange={handleInputChange}
                name='file'
                type='file'
                accept='.csv'
              />
            </label>

            {showButtton && (<button disabled={appStatus === APP_STATUS.UPLOADING}>
              {BUTTON_TEXT[appStatus]}
            </button>
            )}
          </form>
        )
      }

      {
        appStatus === APP_STATUS.READY_USAGE && (
          <Search initialData={data} />
        )
      }
    </>
  )
}

export default App
