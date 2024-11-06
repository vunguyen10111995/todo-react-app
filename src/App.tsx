import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

type TodoItem = { id: string, text: string, completed: boolean }

function App() {
  const [value, setValue] = useState<string>('');
  const [isCompletedAll, setIsCompletedAll] = useState(false);
  const [list, setList] = useState<TodoItem[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('')

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputText = (e.target as any).value.trim();
    if (e.which === 13) {
      setList([...list, {
        id: Math.random()
          .toString(16)
          .substring(2),
        text: inputText,
        completed: false
      }])
      setValue('');
    }
  }

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>, todoItem: TodoItem) => {
    const todoAfterRemove = list.filter(item => item.id !== todoItem.id);
    setList(todoAfterRemove)
  }

  const handleCheckTodo = (event: React.ChangeEvent<HTMLInputElement>, todo: TodoItem) => {
    const newTodo = list.map((item: TodoItem) => {
      if (item.id == todo.id) {
        return {
          ...item,
          completed: item.completed ? false : true
        }
      }

      return item;
    })

    if (newTodo.every(item => !!item.completed)) {
      setIsCompletedAll(true)
    } else {
      setIsCompletedAll(false)
    }

    setList(newTodo)
  }

  const handleToggleCompleted = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCompletedAll(!isCompletedAll);

    const newList = list.map((item: TodoItem) => {
      return {
        ...item,
        completed: !isCompletedAll
      };
    })

    setList(newList)
  }

  const filterTodo = (_: React.MouseEvent<HTMLButtonElement>, type: 'all' | 'active' | 'completed') => {
    setCurrentFilter(type);
  }

  const removeCompletedTodo = (_: React.MouseEvent<HTMLButtonElement>) => {
    const activeTodo = list.filter(item => !item.completed);

    setList(activeTodo)
  }

  return (
    <div className="todo-app">
      {
        list.length > 0 && <input type='checkbox' checked={isCompletedAll} onChange={(e) => handleToggleCompleted(e)} />
      }
      <input placeholder={'What needs to be done?'} value={value} onChange={(e) => handleOnChange(e)} onKeyDown={(e) => handleSubmit(e)} />
      {
        list.length > 0 && list
          .filter(item => {
            if (!currentFilter || currentFilter === 'all') return true;
            if (currentFilter === 'active') return !item.completed;
            if (currentFilter === 'completed') return item.completed;
            return false;
          })
          .map(item => (
            <div key={item.id}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => handleCheckTodo(e, item)}
              />
              {item.text}
              <button onClick={(event) => handleRemove(event, item)}>
                Remove
              </button>
            </div>
          ))
      }
      <div>
        <span>
          {

            list.filter((item) => {
              if (!currentFilter || currentFilter === 'all') return true;
              if (currentFilter === 'active') return !item.completed;
              if (currentFilter === 'completed') return item.completed

              return false
            }).length
          } item{list.filter((item) => {
            if (!currentFilter || currentFilter === 'all') return true;
            if (currentFilter === 'active') return !item.completed;
            if (currentFilter === 'completed') return item.completed

            return false
          }).length > 1 ? 's' : ''} left
        </span>
        <div>
          <button onClick={(event) => filterTodo(event, 'all')}>
            All
          </button>
          <button onClick={(event) => filterTodo(event, 'active')}>
            Active
          </button>
          <button onClick={(event) => filterTodo(event, 'completed')}>
            Completed
          </button>
        </div>
        <button onClick={event => removeCompletedTodo(event)}>
          Clear completed
        </button>
      </div>

    </div>
  );
}

export default App;
