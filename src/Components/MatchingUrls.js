import { Box, Button, Chip, TextField } from "@mui/material"

export const MatchingUrls = ({ name, value, handleUrlChange, addUrls, data, removeUrl}) => {
    
    return (
        <Box display='flex' flexDirection="column" my={2}>
              <Box display='flex' gap={1}>
                <TextField
                  name={name}
                  label= {name === 'notContaining' ? "Not containing" : name[0].toUpperCase() + name.slice(1)}
                  value={value}
                  size="small"
                  variant="standard"
                  onChange={handleUrlChange}
                />
                <Button name={name} variant="contained" sx={{ margin: "10px 20px"}}
                  onClick={ addUrls }
                >Add</Button>
              </Box>
              <Box display="flex" my={1} gap={2} flexDirection="column"
                alignItems="flex-start"
              >
                { data.map((url, i) => {
                  return (
                    <Chip key={i}
                      label={url}
                      onDelete={() => {
                        removeUrl(name, i)
                      }}
                    />
                  )
                }) }
              </Box>
            </Box>
    )
}