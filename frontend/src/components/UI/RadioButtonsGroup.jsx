import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { PersonStanding } from 'lucide-react';
import Diversity3Icon from '@mui/icons-material/Diversity3';

export default function RadioButtonsGroup({ value, setValue }) {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel
        id="controlled-radio-buttons-group"
        style={{ color: 'var(--TETRIS_GREEN)' }}
      >
        Select game mode:
      </FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel
          value="solo"
          control={
            <Radio
              sx={{
                color: 'var(--TETRIS_WHITE)',
                '&.Mui-checked': {
                  color: 'var(--TETRIS_WHITE)'
                }
              }}
            />
          }
          label={
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              Solo
              <PersonStanding color="var(--TETRIS_WHITE)" />
            </div>
          }
          sx={{
            color: 'var(--TETRIS_WHITE)'
          }}
        />
        <FormControlLabel
          value="competition"
          control={
            <Radio
              sx={{
                color: 'var(--TETRIS_WHITE)',
                '&.Mui-checked': {
                  color: 'var(--TETRIS_WHITE)'
                }
              }}
            />
          }
          label={
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              Competition
              <Diversity3Icon
                sx={{
                  color: 'var(--TETRIS_WHITE)'
                }}
              />
            </div>
          }
          sx={{
            color: 'var(--TETRIS_WHITE)'
          }}
        />
      </RadioGroup>
    </FormControl>
  );
}
