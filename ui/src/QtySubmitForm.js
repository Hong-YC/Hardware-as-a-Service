
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

import {checkIn, checkOut} from './ApiCalls'

const QtySubmitForm = (props) => {
  const [qty, setQty] = useState('')

  const handleSubmit=(event)=>{ 
    event.preventDefault()
    props.handleSubmitQty(props.submit_type, qty, props.setID)
    setQty('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            label="Enter Qty"
            id="outlined-size-small"
            size="small"
            type="number"
            value={qty}
            onChange={(e)=>setQty(e.target.value)}
          />
        
          <Button size="small" sx={{mt:0.5}} type="submit">
            {props.submit_type === 'checkIn' ? "Check In" : "Check Out"}
          </Button>
      </form>
    </div>
  )
}
// return (
//      <div>
      // <TextField
      //     inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      //     label="Enter Qty"
      //     id="outlined-size-small"
      //     size="small"
      //     type="number"
      //     value={qty}
      //     onChange={(e)=>setQty(e.target.value)}
      //   />
        
      // {props.submit_type === 'checkIn'
      // ? 
      // <Button size="small" sx={{mt:0.5}} onClick={(e)=>handleSubmit(e)}>Check In</Button>
      // :
      // <Button size="small" sx={{mt:0.5}} onClick={(e)=>handleSubmit(e)}>Check Out</Button>
      // }
      
//      </div>
// )}

export default QtySubmitForm;
