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

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import React, { useState, useEffect } from 'react';
import { IonApp, setupIonicReact, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonButton, IonModal, IonItemSliding, IonItem, IonItemOptions, IonItemOption } from '@ionic/react';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import { Task } from './interfaces/types';
import { useTodos } from './hooks/useTodos';
import { fetchWeatherWithGeolocation } from './hooks/locationService';

setupIonicReact();

const App: React.FC = () => {
  const { tasks, addTask, deleteTask, updateTask } = useTodos();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherWithGeolocation(setWeather);
  }, []);

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
            <IonItemSliding key={task.id}>
              <IonItem>
                <TaskItem
                  task={task}
                  onDelete={deleteTask}
                  onUpdate={(task) => {
                    setEditingTask(task);
                    setShowModal(true);
                  }}
                />
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color="primary" onClick={() => {
                  setEditingTask(task);
                  setShowModal(true);
                }}>Modifier</IonItemOption>
                <IonItemOption color="danger" onClick={() => deleteTask(task.id)}>Supprimer</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
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
};

export default App;
