import './Upload.css';
import axios from 'axios';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, value) {
  return { name, value };
}

let rows = [];

function Upload(props) {
    const [activeStep, setActiveStep] = useState(0);
    const [selectImg, setSelectImg] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [description, setDescription] = useState('');

    const handleDescription = (event) => {
        setDescription(event.target.value);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep === steps.length-1) {
            console.log('upload done');
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setSelectImg(false);
    };

    const handleReset = () => {
        setActiveStep(0);
        setSelectImg(false);
    };

    const setImage = (event) => {
        let reader = new FileReader();

        reader.onload = function(event) {
            let img = document.createElement("img");
            img.setAttribute("src", event.target.result);
            document.querySelector("div#image_container").appendChild(img);
            setImgSrc(event.target.result);
        };
        setSelectImg(true);
        reader.readAsDataURL(event.target.files[0]);
    }

    const sendData = () => {
        var frm = new FormData();
        var photoFile = document.getElementById("photo");
        frm.append("image", photoFile.files[0]);
        axios.post('http://localhost:3080/upload', frm, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        })
        .then((response) => {
            console.log(response.data);
            let resultData = response.data;
            rows = [];
            rows = [
                createData('음식 이름', resultData['name']),
                createData('중량(g)', resultData['weight_g']),
                createData('에너지(kcal)', resultData['calorie_kcal']),
                createData('탄수화물(g)', resultData['Carbohydrate_g']),
                createData('당류(g)', resultData['sugars_g']),
                createData('지방(g)', resultData['fat_g']),
                createData('단백질(g)', resultData['protein_g']),
                createData('칼슘(mg)', resultData['calcium_mg']),
                createData('인(mg)', resultData['phosphorus_mg']),
                createData('나트륨(mg)', resultData['sodium_mg']),
                createData('칼륨(mg)', resultData['potassium_mg']),
                createData('마그네슘(mg)', resultData['magnesium_mg']),
                createData('철(mg)', resultData['iron_mg']),
                createData('아연(mg)', resultData['zinc_mg']),
                createData('콜레스테롤(mg)', resultData['cholesterol_mg']),
                createData('트랜스지방(g)', resultData['transFat_g']),
            ]
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const steps = [
        {
          label: '음식 사진을 업로드해주세요.',
          content: <div><form>
                        <IconButton color="primary" aria-label="upload picture" component="label">
                            <input id='photo' hidden type="file" name="image" onChange={setImage} />
                            <PhotoCamera />
                        </IconButton>
                        <div id="image_container"></div><br /><br /><br />
                        <Button variant="contained" component="label" disabled={!selectImg}>
                            예측하기
                            <button hidden type="button" onClick={sendData}></button>
                        </Button>
                    </form></div>,
        },
        {
          label: '예측된 결과가 맞나요?',
          content:
          <div><br /><div id="image_container2"><img src={imgSrc} alt='foodImg'></img></div><br />
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} aria-label="customized table">
                <TableHead>
                <TableRow>
                    <StyledTableCell>항목</StyledTableCell>
                    <StyledTableCell align="center">값</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                        {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.value}</StyledTableCell>
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            <br />
            </div>,
        },
        {
          label: '피드를 등록합니다.',
          content: 
          <div>
                <TextField
                    sx={{ minWidth: 300, width: '90%', marginTop: 3 }}
                    id="outlined-multiline-static"
                    label="피드 설명"
                    multiline
                    rows={4}
                    defaultValue=""
                    onChange={handleDescription}
                />
          </div>,
        },
      ];

    return (
        <div id='Upload'>
            <Box sx={{ maxWidth: 600 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                <Step key={step.label}>
                    <StepLabel
                    optional={
                        index === 2 ? (
                        <Typography variant="caption">설명추가</Typography>
                        ) : null
                    }
                    >
                    {step.label}
                    </StepLabel>
                    <StepContent>
                    <Typography component={'span'}>{step.content}</Typography>
                    <Box sx={{ mb: 2 }}>
                        {activeStep ? <div>
                        <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                        >
                            뒤로
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                        >
                            {index === steps.length - 1 ? '등록' : '다음'}
                        </Button>
                        </div> : <div></div>}
                        
                    </Box>
                    </StepContent>
                </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>피드 등록이 완료되었습니다.</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                    새로운 피드 등록하기
                </Button>
                </Paper>
            )}
            </Box>
        </div>
    );
}

export default Upload;