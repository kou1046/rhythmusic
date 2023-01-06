import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import AppBar from "@mui/material/AppBar";
import { InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

type PropsType = {
    value: string
}

const SearchBar = ({ value: string }: PropsType) => {

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
          width: '100%',
        },
      }));

    return <>
        
    </>
}

export default SearchBar