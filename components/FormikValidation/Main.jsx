import React, { useRef } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as yup from "yup";
import KErrorMessage from "./KErrorMessage";
import PreviewImage from "./PreviewImage"

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

const validationSchema = yup.object({

  

  name: yup.string().required("Name is Required!"),
  phone: yup
    .string()
    .matches(
        /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/g,
        'Not a Phone Number'
    )
    
   
    .required("Phone is Required!"),

  file: yup
      .mixed()
      .nullable()
      .required()
      .test(
        'FILE_SIZE',
        'Uploaded file is too big',
        (value) => !value || (value && value.size <= 1024 * 1024)
      )
      .test(
        'FILE_FORMAT',
        'Uploaded file has unsupported format.',
        (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
      ),



  password: yup
    .string()
        .min(8, 'Password must be at least 6 charaters')
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase letter')
        .matches(/[A-Z]/, 'Password requires an uppercase letter')
        .matches(/[^\w]/, 'Password requires a symbol')
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    // )
    .required("Password is Required!"),
    confirmPassword: yup.string()
    .oneOf([yup.ref('password'),null],
    'Your Confirm Password mush match'
    ),
  gender: yup.string().required("Gender is Required!"),
  date: yup.date().required("Date of Birth is required"),
  income: yup.string().required("Required"),
  about: yup
    .string()
    .min(5, "too small!")
    .max(500, "Too Long String")
    .required("Required"),
  social: yup
    .array()
    .of(
      yup
        .string("String is Required!")
        .min(4, "Too Short")
        .max(20, "Too Long")
        .required("Required")
    )
    .min(1, "Atleast One Social Media is Required!")
   
 
});
const Main = () => {
  const fileRef = useRef(null)
  return (
    <div>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          name: "",
          phone: "",
          file:null,
          password: "",
          confirmPassword:"",
          gender: "",
          date: "",
          income: "",
          about: "",
          social: [],
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values ,setFieldValue}) => (
          <Form className="pl-10 ">
            <div className="">
            <label>Name:</label>
            <Field className="border border-black py-2  ml-8 px-2  w-[300px] rounded-md" name="name" type="text" />
            </div>
           <div className="pl-[85px] ">
           <KErrorMessage name="name" />
           </div>


           <div className="pt-5"> 
           <label>Phone:</label>
            <Field className="border border-black py-2  ml-7  px-2 w-[300px] rounded-md" name="phone" type="number" />
            <div className="pl-[86px]">
            <KErrorMessage name="phone" />
            </div>
           </div>

           <div>
            <input 
            ref={fileRef}
            hidden type='file'  onChange={(e) => {
              setFieldValue('file', e.target.files[0])
            }} />
           </div>
              
              {values.file && <PreviewImage file={values.file} />}
              < KErrorMessage name='file' />

           <button onClick={() => {
            fileRef.current.click()
           }}>
            Upload
           </button>
           
           <div className="pt-5">
           <label>Password:</label>
            <Field className="border border-black py-2 px-2 ml-2 w-[300px]  rounded-md" name="password" type="password" />
           <div className="pl-[85px]">
           <KErrorMessage name="password" />
           </div>
           </div>
           <div className="pt-5">
           <label>Confirm Password:</label>
            <Field className="border border-black py-2 px-2 ml-2 w-[300px]  rounded-md" name="confirmPassword" type="password" />
           <div className="pl-[85px]">
           <KErrorMessage name="confirmPassword" />
           </div>
           </div>
            
            <div className="pt-5">
            <label className="pr-6">Gender:</label>
           
           <label className="pr-2">Male:</label>
           <Field name="gender" value="male" type="radio" />
           <label className="pl-5 pr-2">Female:</label>
           <Field name="gender" value="female" type="radio" />
                <div className="pl-[85px]">
                <KErrorMessage name="gender" />
                </div>
            </div>
         
         <div className="pt-5">
            
         <label className="pr-10" >Date:</label>
            <Field name="date" type="date" />
           <div className="pl-[85px]">
           <KErrorMessage name="date" />
           </div>
         </div>
       
            <div className="pt-5">
            <label className="pr-5">Income:</label>
            <Field className="border p-2 border-black rounded-md" name="income" as="select">
              <option value="0">Rp.6000000</option>
              <option value="1000">Rp.12000000</option>
              <option value="10000">Rp.25000000</option>
            </Field>
            <div className="pl-[85px]">
            <KErrorMessage name="income" />
            </div>
            </div>
     
            <div className="pt-5">
          <div className="flex items-center">
          <label className="pr-8">About:</label>
            <Field className="mt-5 border p-2 border-black rounded-md" name="about" as="textarea" />
          </div>
            
            <div className="pl-[85px]">
            <KErrorMessage name="about" />
            </div>

            </div>
        
           <div>
           <label>Social:</label>
            <KErrorMessage name="social" />
           </div>
         
           <div className="pt-2">
           <label className="pr-3">Facebook:</label>
            <Field className="border rounded-md p-1 border-black" name="social[0]" type="text" />

            <div className="pl-[85px]">
            <KErrorMessage name="social.0" />
            </div>
            
           <div className="pt-5">
           <label className="pr-[30px]">Twitter:</label>
            <Field className="border rounded-md p-1 border-black" name="social[1]" type="text" />
           <div className="pl-[85px]">
           <KErrorMessage name="social.1" />
           </div>
           </div>
           </div>
            <KErrorMessage name={`hobbies`} /> 


            <div className="pt-5 pl-[100px]">
            <button className="bg-blue-500 rounded-full text-white px-7 py-2" type="submit">Submit</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Main;