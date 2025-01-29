import React, { useState } from 'react';
import { IonItem, IonButton } from '@ionic/react';
import ConfirmationDialog from './ConfirmationDialog';
import { Task } from '../interfaces/types';
/* Theme variables */
import '../theme/variables.css';
const TaskItem: React.FC<{ task: Task; onDelete: (id: number) => void; onUpdate: (task: Task) => void }> = ({ task, onDelete, onUpdate }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  try {
    return (
      <IonItem>
        <div>
          <h2>{task.title}</h2>
          <p>Catégorie : {task.category}</p>
          <p>Statut : {task.status}</p>
          <p>Date limite : {task.dueDate.toLocaleDateString()}</p>
        </div>
        <IonButton color="primary" onClick={() => onUpdate(task)}>
          Modifier
        </IonButton>
        <IonButton color="danger" onClick={() => setShowConfirmDelete(true)}>
          Supprimer
        </IonButton>
        {showConfirmDelete && (
          <ConfirmationDialog
            message="Êtes-vous sûr de vouloir supprimer cette tâche ?"
            onConfirm={() => {
              try {
                onDelete(task.id);
              } catch (error) {
                console.error('Failed to delete task:', error);
              } finally {
                setShowConfirmDelete(false);
              }
            }}
            onCancel={() => setShowConfirmDelete(false)}
          />
        )}
      </IonItem>
    );
  } catch (error) {
    console.error('Failed to render task item:', error);
    return null;
  }
};

export default TaskItem;