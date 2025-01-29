import React, { useState } from 'react';
import { IonItem, IonInput, IonLabel, IonSelect, IonSelectOption, IonButton } from '@ionic/react';
import ConfirmationDialog from './ConfirmationDialog';
import { Task } from '../interfaces/types';
/* Theme variables */
import '../theme/variables.css';
const TaskForm: React.FC<{ onSave: (task: Task) => void; onCancel: () => void; existingTask?: Task }> = ({ onSave, onCancel, existingTask }) => {
  const [formState, setFormState] = useState<Task>(
    existingTask ?? {
      id: Date.now(),
      title: '',
      category: '',
      status: 'À faire',
      dueDate: new Date(),
    }
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; category?: string; dueDate?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; category?: string; dueDate?: string } = {};

    if (!formState.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formState.category.trim()) {
      newErrors.category = 'La catégorie est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    try {
      if (validate()) {
        setShowConfirm(true);
      }
    } catch (error) {
      console.error('Failed to handle save:', error);
    }
  };

  try {
    return (
      <>
        <IonItem>
          <IonLabel position="floating">Titre</IonLabel>
          <IonInput
            value={formState.title}
            onIonChange={(e) => setFormState({ ...formState, title: e.detail.value! })}
          />
        </IonItem>
        {errors.title && <p style={{ color: 'red', paddingLeft: '15px' }}>{errors.title}</p>}

        <IonItem>
          <IonLabel position="floating">Catégorie</IonLabel>
          <IonInput
            value={formState.category}
            onIonChange={(e) => setFormState({ ...formState, category: e.detail.value! })}
          />
        </IonItem>
        {errors.category && <p style={{ color: 'red', paddingLeft: '15px' }}>{errors.category}</p>}

        <IonItem>
          <IonLabel position="floating">Statut</IonLabel>
          <IonSelect
            className="select-wrapper-inner"
            value={formState.status}
            onIonChange={(e) => setFormState({ ...formState, status: e.detail.value })}
          >
            <IonSelectOption value="À faire">À faire</IonSelectOption>
            <IonSelectOption value="En cours">En cours</IonSelectOption>
            <IonSelectOption value="Terminé">Terminé</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Date limite</IonLabel>
          <IonInput
            type="date"
            value={formState.dueDate.toISOString().split('T')[0]}
            onIonChange={(e) => setFormState({ ...formState, dueDate: new Date(e.detail.value!) })}
          />
        </IonItem>
        {errors.dueDate && <p style={{ color: 'red', paddingLeft: '15px' }}>{errors.dueDate}</p>}

        <IonButton expand="block" onClick={handleSave}>
          {existingTask ? 'Mettre à jour' : 'Ajouter'}
        </IonButton>

        <IonButton expand="block" color="light" onClick={onCancel}>
          Annuler
        </IonButton>

        {showConfirm && (
          <ConfirmationDialog
            message={`Êtes-vous sûr de vouloir ${existingTask ? 'mettre à jour' : 'ajouter'} cette tâche ?`}
            onConfirm={() => {
              try {
                onSave(formState);
              } catch (error) {
                console.error('Failed to save task:', error);
              } finally {
                setShowConfirm(false);
              }
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </>
    );
  } catch (error) {
    console.error('Failed to render task form:', error);
    return null;
  }
};

export default TaskForm;