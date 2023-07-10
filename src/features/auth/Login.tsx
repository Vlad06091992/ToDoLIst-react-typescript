import React from 'react'
import {useFormik, FormikHelpers} from 'formik'
import {useSelector} from 'react-redux'
import {login} from './auth-reducer'
import {Navigate} from 'react-router-dom'
import {useAppDispatch} from 'hooks/useAppDispatch';
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from '@mui/material'
import {selectIsLoggedIn} from "features/auth/auth-selectors";
import {LoginParamsType} from "features/auth/auth-api";
import {RejectType} from "common/utils/create-app-async-thunk";
import style from "./Login.module.css"

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const formik = useFormik({
        validate: (values) => {
            // if (!values.email) {
            //     return {
            //         email: 'Email is required'
            //     }
            // }
            // if (!values.password) {
            //     return {
            //         password: 'Password is required'
            //     }
            // }

        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
            dispatch(login(values))
                .unwrap()
                .then(res => {
                    debugger
                })
                .catch((reason: RejectType) => {
                    let fieldsErrors = reason.fieldsErrors
                    if (fieldsErrors) {
                        fieldsErrors.forEach((el) => formikHelpers.setFieldError(el.field, el.error))
                    }

                });
        },
    })

    if (isLoggedIn) {
        return <Navigate to={"/"}/>
    }


    return <Grid container justifyContent="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To log in get registered <a href={'https://social-network.samuraijs.com/'}
                                                        target={'_blank'}>here</a>
                        </p>
                        <p>
                            or use common test account credentials:
                        </p>
                        <p> Email: free@samuraijs.com
                        </p>
                        <p>
                            Password: free
                        </p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.errors.email ? <div className={style.error}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.errors.password ? <div className={style.error}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                {...formik.getFieldProps("rememberMe")}
                                checked={formik.values.rememberMe}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}

