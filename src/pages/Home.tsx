import Tooltip from "../components/Tooltip";
import TaskApp from "../components/task-management/TaskApp";
import WeatherApp from "../components/weather/WeatherApp";

function Home() {
  return (
    <div className="home-page flex-col">
      <div className="dash-items">
        <div className="tasks-and-weather">
          <div className="tasks">
            <div className="dummy-div flex-col">
              <div className="title-and-info flex">
                <h2>Agenda</h2>
                <Tooltip text={"Today's tasks, filtered by date"} />
              </div>
              <TaskApp source={"dashboard"} />
            </div>
          </div>
          <div className="weather flex-col">
            <WeatherApp />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
