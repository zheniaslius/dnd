import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import TaskList from './components/TaskList/TaskList';

const App = () => {
  const [taskList, setTaskList] = useState({
    Backlog: [{ name: 'eat', createdAt: new Date().toISOString() }],
    'In Process': [{ name: 'eating', createdAt: new Date().toISOString() }],
    Done: [],
  });

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over || !event.active.data.current || !event.over.data.current) return;

    if (event.active.id === event.over.id) return;

    if (event.active.data.current.sortable.containerId !== event.over.data.current.sortable.containerId)
      return;

    const containerName = event.active.data.current.sortable.containerId;
    setTaskList((prevTaskList) => {
      const updatedTaskList: any = { ...prevTaskList };
      if (!event.over) return updatedTaskList;
      const oldIndex = updatedTaskList[containerName].findIndex((task: any) => task.name === event.active.id);
      const newIndex = updatedTaskList[containerName].findIndex((task: any) => task.name === event.over.id);
      updatedTaskList[containerName] = arrayMove(updatedTaskList[containerName], oldIndex, newIndex);
      return updatedTaskList;
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) return;

    const initialContainer = event.active.data.current?.sortable?.containerId;
    const targetContainer = event.over.data.current?.sortable?.containerId;

    if (!initialContainer) return;

    setTaskList((prevTaskList) => {
      const updatedTaskList: any = { ...prevTaskList };

      if (!targetContainer) {
        if (prevTaskList[event.over!.id].find((task: any) => task.name === event.active.id))
          return updatedTaskList;

        updatedTaskList[initialContainer] = updatedTaskList[initialContainer].filter(
          (task: any) => task.name !== event.active.id.toString()
        );

        updatedTaskList[event.over!.id].push({
          name: event.active.id.toString(),
          createdAt: new Date().toISOString(),
        });

        return updatedTaskList;
      }

      if (initialContainer === targetContainer) {
        const oldIndex = updatedTaskList[initialContainer].findIndex(
          (task: any) => task.name === event.active.id
        );
        const newIndex = updatedTaskList[initialContainer].findIndex(
          (task: any) => task.name === event.over!.id
        );
        updatedTaskList[initialContainer] = arrayMove(updatedTaskList[initialContainer], oldIndex, newIndex);
      } else {
        updatedTaskList[initialContainer] = updatedTaskList[initialContainer].filter(
          (task: any) => task.name !== event.active.id.toString()
        );

        const newIndex = updatedTaskList[targetContainer].findIndex(
          (task: any) => task.name === event.over!.id
        );
        updatedTaskList[targetContainer].splice(newIndex, 0, {
          name: event.active.id.toString(),
          createdAt: new Date().toISOString(),
        });
      }

      return updatedTaskList;
    });
  };

  const addTaskToTaskList = (title: string, task: string) => {
    setTaskList((prevTaskList) => {
      const updatedTaskList: any = { ...prevTaskList };
      if (updatedTaskList[title]) {
        updatedTaskList[title] = [
          ...updatedTaskList[title],
          { name: task, createdAt: new Date().toISOString() },
        ];
      }
      return updatedTaskList;
    });
  };

  const sortTasksByDate = () => {
    setTaskList((prevTaskList) => {
      const updatedTaskList: any = {};
      Object.keys(prevTaskList).forEach((key) => {
        updatedTaskList[key] = [...prevTaskList[key]].sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
      });
      return updatedTaskList;
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <main className="flex flex-col items-center gap-8 p-8">
        <section className="flex w-3/4 min-h-96 justify-around">
          {Object.keys(taskList).map((key) => (
            <TaskList
              key={key}
              title={key}
              tasks={taskList[key].map((task: any) => task.name)}
              onAddTask={(task) => addTaskToTaskList(key, task)}
            />
          ))}
        </section>
        <button className="border bg-blue-500 text-white p-4 rounded-md" onClick={sortTasksByDate}>
          Sort by Date of Creation
        </button>
      </main>
    </DndContext>
  );
};

export default App;
