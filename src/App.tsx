/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

import React, { useState, useEffect } from 'react';
import { IonApp, setupIonicReact,IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonModal, IonInput, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';

import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import { Task } from './interfaces/types';
import { useTodos } from './hooks/useTodos';
import { Geolocation } from '@capacitor/geolocation';

const App: React.FC = () => {
  const { tasks, addTask, deleteTask, updateTask } = useTodos();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherWithGeolocation = async () => {
      try {
        // Get the user's current position
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = position.coords;

        // Fetch weather data for the current location
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=055edc42bdc91b2c5390365d1ae87c67&units=metric`
        );
        const data = await response.json();

        if (data.weather && data.weather.length > 0 && data.main) {
          setWeather(`${data.weather[0].description}, ${data.main.temp}°C`);
        } else {
          setWeather("Données météo indisponibles");
        }
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        setWeather('Météo indisponible');
      }
    };

    fetchWeatherWithGeolocation();
  }, []);
  try {
    return (
      <IonApp>
        <IonHeader>
          <IonToolbar>
            <IonTitle>TaskMaster {weather && `| Meteo: ${weather}`}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonButton expand="block" onClick={() => {
            setEditingTask(undefined);
            setShowModal(true);
          }}>
            Ajouter une tâche
          </IonButton>

          <IonList>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onUpdate={(task) => {
                  setEditingTask(task);
                  setShowModal(true);
                }}
              />
            ))}
          </IonList>

          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>{editingTask ? 'Modifier Tâche' : 'Nouvelle Tâche'}</IonTitle>
              </IonToolbar>
            </IonHeader>

            <IonContent>
              <TaskForm
                existingTask={editingTask}
                onSave={(task) => {
                  try {
                    if (editingTask) {
                      updateTask(task);
                    } else {
                      addTask(task);
                    }
                  } catch (error) {
                    console.error('Failed to save or update task:', error);
                  } finally {
                    setShowModal(false);
                  }
                }}
                onCancel={() => setShowModal(false)}
              />
            </IonContent>
          </IonModal>
        </IonContent>
      </IonApp>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    return null;
  }
};

export default App;
