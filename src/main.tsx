import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './globals.css'
import {
  ThemeProvider,
  PreferredUnitsProvider,
  ProfileProvider,
  ConditionsProvider,
  AppSettingsProvider,
  CalculatorProvider,
} from './context'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <PreferredUnitsProvider>
        <ProfileProvider>
          <ConditionsProvider>
            <AppSettingsProvider>
              <CalculatorProvider>
                <App />
              </CalculatorProvider>
            </AppSettingsProvider>
          </ConditionsProvider>
        </ProfileProvider>
      </PreferredUnitsProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
