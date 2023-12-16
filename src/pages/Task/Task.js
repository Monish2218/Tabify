import "./Task.css";
import { useBrowser } from "../../context/browser-context";
import { Fragment, useEffect, useState } from "react";
import { quotes } from "../../db/quotes";
import { Todo } from "../../components/Todo/Todo";

const index = Math.floor(Math.random() * quotes.length);
const quote = quotes[index].quote;

export const Task = () => {

    const [isChecked, setIsChecked] = useState(false);
    const [isTodoOpen, setIsTodoOpen] = useState(false);

    const {name, time, message, task, browserDispatch} = useBrowser();

    useEffect(() => {
        const userTask = localStorage.getItem("task");
        browserDispatch({
            type: "TASK",
            payload: userTask
        });
        if (new Date().getDate() !== Number(localStorage.getItem("date"))){
            localStorage.removeItem("task");
            localStorage.removeItem("date");
            localStorage.removeItem("checkedStatus");
        }
    }, [])

    useEffect(() => {
        const checkStatus = localStorage.getItem("checkedStatus");
        checkStatus === "true" ? setIsChecked(true) : setIsChecked(false)
    }, [])

    useEffect(() => {
        getCurrentTime();
    }, [time])

    const getCurrentTime = () => {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();

        const hour = hours < 10 ? `0${hours}` : hours;
        const minute = minutes < 10 ? `0${minutes}` :  minutes;

        const currentTime = `${hour}:${minute}`
        setTimeout(getCurrentTime, 1000);

        browserDispatch({
            type: "TIME",
            payload: currentTime
        })

        browserDispatch({
            type: "MESSAGE",
            payload: hours
        })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
    }

    const handleTaskChange = (event) => {
        if (event.key === "Enter" && event.target.value.length > 0){
            browserDispatch({
                type: "TASK",
                payload: event.target.value
            });
            localStorage.setItem("task", event.target.value);
            localStorage.setItem("data", new Date.getDate());
        }
    }

    const handleCompleteTaskChange =  (event) => {
        if (event.target.checked){
            setIsChecked(isChecked => !isChecked)
        }else{
            setIsChecked(isChecked => !isChecked)
        }
        localStorage.setItem("checkedStatus", !isChecked);
    }

    const handleClearClick = () => {
        browserDispatch({
            type: "CLEAR"
        })
        setIsChecked(false);
        localStorage.removeItem("task");
        localStorage.removeItem("checkedStatus");
    }

    const handleToDoClick = () => {
        setIsTodoOpen(isTodoOpen => !isTodoOpen);
    }

    return (
        <div className="task-container d-flex direction-column align-center relative">
            <span className="time">{time}</span>
            <span className="message">{message}, {name}</span>
            {name !== null && task === null ? (
            <Fragment>
                <span className="focus-question">What is your main focus for today?</span>
                <form onSubmit={handleFormSubmit}>
                    <input required className="input task-input" onKeyPress={handleTaskChange}/>
                </form>
            </Fragment>) : (
                <div className="user-task-container d-flex direction-column align-center gap-sm">
                <span className="heading-2">Today's Focus</span>
                <div className="d-flex align-center gap">
                    <label className={`${isChecked ? "strike-through" : ""} heading-3 d-flex align-center gap-sm cursor`}>
                            <input className="check cursor" type="checkbox" onChange={handleCompleteTaskChange} checked={isChecked}/>
                            {task}
                    </label>
                    <button className="button cursor" onClick={handleClearClick}>
                        <span class="material-icons-outlined">
                            clear
                        </span>
                    </button>
                </div>
                
            </div>
            )}
            <div className="quote-container">
                <span className="heading-3">{quote}</span>
            </div>
            {isTodoOpen && <Todo />}
            <div className="todo-btn-container absolute">
                <button className="button cursor todo-btn" onClick={handleToDoClick}>ToDo</button>
            </div>
            
        </div>
        
    )
}