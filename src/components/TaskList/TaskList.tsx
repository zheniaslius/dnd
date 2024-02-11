import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { FC } from 'react';
import TaskItem from '../Task/Task';

interface ITaskList {
  title: string;
  tasks: string[];
  onAddTask: (task: string) => void;
}

const TaskList: FC<ITaskList> = (props) => {
  const { setNodeRef } = useDroppable({ id: props.title });

  const [newTask, setNewTask] = useState<string>('');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  const handleTaskInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const handleTaskInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && newTask.trim() !== '') {
      props.onAddTask(newTask);
      setNewTask('');
    }
  };

  const handleAddTaskClick = () => {
    setIsAddingTask(true);
  };

  return (
    <article className="flex flex-col items-center p-4 px-14 min-h-full w-full gap-6">
      <h1 className="text-2xl font-bold text-gray-700">{props.title}</h1>
      <SortableContext id={props.title} items={props.tasks}>
        <ul ref={setNodeRef} className="flex flex-col gap-4 w-full">
          {props.tasks.map((task) => (
            <TaskItem key={task} title={task} />
          ))}
          {isAddingTask ? (
            <li>
              <input
                type="text"
                value={newTask}
                onChange={handleTaskInputChange}
                onKeyDown={handleTaskInputKeyDown}
                autoFocus
                onBlur={() => setIsAddingTask(false)}
                className="border border-gray-400 p-2 rounded-md w-full"
              />
            </li>
          ) : (
            <li
              className="border border-gray-400 p-2 rounded-md w-full cursor-pointer flex items-center justify-center"
              onClick={handleAddTaskClick}
            >
              <span className="text-xl mr-2">+</span> Add new task
            </li>
          )}
        </ul>
      </SortableContext>
    </article>
  );
};

export default TaskList;
