import React from 'react'
import {FormikHelpers, useFormik} from 'formik'
import {useSelector} from 'react-redux'
import {authThunks} from './auth-reducer'
import {Navigate} from 'react-router-dom'
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from '@mui/material'
import {selectIsLoggedIn} from "features/auth/auth-selectors";
import {LoginParamsType} from "features/auth/auth-api";
import {RejectType} from "common/utils/create-app-async-thunk";
import style from "./Login.module.css"
import {useActions} from "hooks/useActions";



export const Login = () => {
    const{login} = useActions(authThunks)
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const formik = useFormik({
        validate: (values) => {

            const errors: Omit<Partial<LoginParamsType>,'captcha'> = {}
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }

            return errors

        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
          login(values)
                .unwrap()
                .catch((reason: RejectType) => {
                    let fieldsErrors = reason.fieldsErrors
                    if (fieldsErrors) {
                        fieldsErrors.forEach((el) =>{
                            formikHelpers.setFieldError(el.field, el.error)})
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
                        {formik.errors.email && formik.touched.email ?
                            <div className={style.error}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.errors.password && formik.touched.password ?
                            <div className={style.error}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                {...formik.getFieldProps("rememberMe")}
                                checked={formik.values.rememberMe}
                            />}
                        />
                        <Button disabled={!!formik.errors.password ||
                            !!formik.errors.email ||
                            formik.values.password.length < 1 ||
                            formik.values.email.length < 1} type={'submit'} variant={'contained'}
                                color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}

