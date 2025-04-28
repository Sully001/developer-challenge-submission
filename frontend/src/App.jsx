import { useState, useEffect } from "react";
import AllCards from "./components/AllCards";
import TaskFormModal from "./components/TaskFormModal";

const App = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllTasks = async () => {
      const response = await fetch("http://localhost:3000/api/tasks");
      const data = await response.json();

      if (response.ok) {
        setAllTasks(data);
        setIsLoading(false);
      }
      console.log(data);
    };
    fetchAllTasks();
  }, []);

  return (
    <>
      <TaskFormModal updateTasks={setAllTasks} formAction="create" />
      <AllCards
        tasks={allTasks}
        isLoading={isLoading}
        updateTasks={setAllTasks}
      />
    </>
  );
};

export default App;
