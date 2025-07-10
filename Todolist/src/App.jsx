import { useState,useEffect} from 'react'
import './App.css'
import Navbar from './Components/navbar.jsx'
import { v4 as uuidv4 } from 'uuid';

function App() {
   const [todo, setTodo] = useState("")
   const [todos, setTodos] = useState([])
   const [showFinished, setshowFinished] = useState(true)

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if(todoString){
      let todos = JSON.parse(localStorage.getItem("todos")) 
      setTodos(todos)
    }
  }, [])
  

  const saveToLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const toggleFinished = (e) => {
    setshowFinished(!showFinished)
  }
  
  


  const handleEdit = (e, id)=>{ 
    let t = todos.filter(i=>i.id === id) 
    setTodo(t[0].todo)
    let newTodos = todos.filter(item=>{
      return item.id!==id
    }); 
    setTodos(newTodos) 
    saveToLS()
  }

  const handleDelete= (e, id)=>{  
    let newTodos = todos.filter(item=>{
      return item.id!==id
    }); 
    setTodos(newTodos) 
    saveToLS()
  }

  const handleAdd= ()=>{
    setTodos([...todos, {id: uuidv4(), todo, isCompleted: false}])
    setTodo("") 
    saveToLS()
  }
  
  const handleChange= (e)=>{ 
    setTodo(e.target.value)
  }

  const handleCheckbox = (e) => { 
    let id = e.target.name;  
    let index = todos.findIndex(item=>{
      return item.id === id;
    }) 
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
    saveToLS()
  }
  

  return (
    <>
      <Navbar />
      <div className='m-auto bg-violet-300 flex flex-col items-center h-[80vh] w-[80vw]'>
        <div className='text-center'>
          <div className="title font-bold text-3xl justify-center">Todo List</div>
          <div className='flex justify-center items-center my-4'>
            <input className='border-2 rounded-2xl mx-5 px-2' type="text" onChange={handleChange} value={todo} />
            <button
              className='bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white'
              onClick={handleAdd}
              disabled={!todo.trim()}
            >
              Add
            </button>
          </div>
          <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>
        </div>
        <input className='my-4' id='show' onChange={toggleFinished} type="checkbox" checked={showFinished} /> 
         <label className='mx-2' htmlFor="show">Show Finished</label> 
        <div className='Todo w-full px-10'>
        <div className='Todo px-10 w-[70%] justify-center'>
{todos
  .filter(item => showFinished || !item.isCompleted)
  .map(item => (
  <div key={item.id} className="flex items-center gap-2 justify-around mb-2">
      <div className="flex items-center gap-2"> 
        <input
          onChange={handleCheckbox}
          type="checkbox"
          name={item.id}
          checked={item.isCompleted}
        />
        <div className={item.isCompleted ? "line-through" : ""}>
          {item.todo}
        </div>
      </div>
      <div>
        <button onClick={(e) => handleEdit(e, item.id)} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1">Edit</button>
        <button onClick={(e) => handleDelete(e, item.id)} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1">Del</button>
      </div>
    </div>
  ))}
</div>


       
        </div>
      </div>
    </>
  )
}

export default App
