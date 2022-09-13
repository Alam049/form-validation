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
    .min(11, "phone number must be at least 11 digits")
    .max(12, "phone number must be at most 12 digits")
    
   
    .required("Phone is Required!"),

  file: yup
      .mixed()
      .nullable()
      .required()
      .test(
        'FILE_SIZE',
        'Uploaded file is too big!',
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
  startDate: yup.date().required("start date is required"),
  endDate: yup.date().when('startDate', (startDate, schema) => {
    return schema.test({
      test: endDate => new Date(startDate) < new Date(endDate),
      message: "endDate should be > startDate"
    })
  }).required(),
  income: yup.string().required(" Income is Required!"),
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
    .min(1, "Atleast One Social Media is Required!"),

    acceptedTos: yup
      .boolean()
      .oneOf([true], 'Please accept the terms of service')
   
 
});


function formatDate(date) {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
  .toISOString()
  .split("T")[0];
}

function addDays(_date, days) {
  const date = new Date(_date)

  date.setDate(date.getDate() + days)

  return date
}





const Main = () => {
  const fileRef = useRef(null)

  // style with tailwindcss
  const titleStyle= 'pl-8 font-medium  text-[#445664]'
  const spanStyle='text-red-600 pl-1'
  const pageStyle= 'text-[#445664] font-bold text-xl pl-8'
  const errorMessage='pl-8 font-medium text-sm pt-1'

  const formStyleDone= 'text-[#445664] bg-[#F4F8FB] pl-4  shadow-md border border-[#c5cfd9] px-3 py-3 w-full rounded-md'
  const formStyleError= 'border px-3 bg-[#F4F8FB] border-red-500 py-3 shadow-md w-full rounded-md'



  return (
    <div>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          name: "",
          phoneCode: '+62',
          phone: "",
          file:null,
          password: "",
          confirmPassword:"",
          gender: "",
          date: "",
          income: "",
          about: "",
          social: [],
          acceptedTos:false,
        }}
        onSubmit={(values, {resetForm}) => {
          console.log(values);
          resetForm({ values: ''})

          const phone = values.phoneCode + values.phone

          console.log(phone)

        }}
      >
        {({ values ,setFieldValue,errors}) => (
          <Form className="">
            <h1 className="text-[#445664] text-2xl font-bold text-center pt-2 pb-8">FORM VALIDATION</h1>
            <p className={`  ${pageStyle}`}>Personal Information</p>

            <div className="pt-4 pl-8">
           <div>
            <input 
            ref={fileRef}
            hidden type='file'  onChange={(e) => {
              setFieldValue('file', e.target.files[0])
            }} />
           </div>
              
              {values.file && <PreviewImage file={values.file} />}
              <div className="pt-1 font-medium text-sm">
              < KErrorMessage name='file' />
              </div>

           <button className="text-[#445664] font-semibold" onClick={() => {
            fileRef.current.click()
           }}>
            Upload Image <span className={spanStyle}>*</span>
           </button>
           </div>
            <div className="pt-3">
            <label className={` ${titleStyle}`}>Name <span className={` ${spanStyle}`}>*</span></label>
           <div className="px-8 pt-1">
            {errors.name && <Field className={`input2 ${formStyleError}`} name="name" type="text"  /> || <Field className={`input ${formStyleDone}`} name="name" type="text" />}
           
           </div>
            </div>
           <div className={` ${errorMessage}`}>
           <KErrorMessage   name="name" />
           </div>


           <div className="pt-5"> 
           <label className={`${titleStyle}`}>Phone <span className={` ${spanStyle}`}>*</span></label>
           <div className="flex pl-8 pt-1 relative">
            {errors.phone && <Field as='select' className=" border border-red-500 py-[12.5px] bg-[#F4F8FB] px-2 w-[70px] rounded-l-md shadow-md" name="phoneCode">
              <option value="+62">+62</option>
             </Field> || <Field as='select' className=" border border-[#c5cfd9] py-[12.5px] input bg-[#F4F8FB] px-2 w-[70px] rounded-l-md shadow-md" name="phoneCode">
              <option className="cursor-none" value="+62">+62</option>
             </Field>}
            <div className=" pt-1 absolute left-[84px] top-0">
              {errors.phone && <Field className='border border-red-500 text-[#445664] bg-[#F4F8FB] py-3 w-[365px] px-3 rounded-md rounded-l-none input2 shadow-md' name="phone" type="string" /> || <Field className='border border-[#c5cfd9] text-[#445664] bg-[#F4F8FB] py-3 w-[365px] px-3
               rounded-md rounded-l-none input shadow-md' name="phone" type="string" /> }
            
            </div>
           </div>
            <div className={` ${errorMessage}`}>
            <KErrorMessage name="phone" />
            </div>
           </div>

           
           
           <div className="pt-5">
           <label className={titleStyle} >Password <span className={spanStyle}>*</span></label>
           <div className="px-8 pt-1">
           {errors.password && <Field className={`  input2 ${formStyleError}`} name="password" type="password" /> || <Field className={` input ${formStyleDone}`} name="password" type="password" /> }
           </div>
           <div className={` ${errorMessage}`}>
           <KErrorMessage name="password" />
           </div>
           </div>
           <div className="pt-5">
           <label className={titleStyle}>Confirm Password <span className={spanStyle}>*</span></label>
           <div className="px-8 pt-1">
           {errors.confirmPassword && <Field className={`input2 ${formStyleError}`} name="confirmPassword" type="password" /> || <Field className={` input ${formStyleDone}`} name="confirmPassword" type="password" /> }
           </div>
            
           <div className={errorMessage}>
           <KErrorMessage name="confirmPassword" />
           </div>
           </div>
            
            <div className="pt-5 ">
            <div>
            <label className={titleStyle}>Gender <span className={spanStyle}>*</span></label>
            </div>
           
         <div className="pt-3 pl-8 flex gap-5">
         <div className="">
         <Field  name="gender" value="male" type="radio" />
         <label className="pl-2 font-semibold text-[#445664]">Male</label>
         </div>
         <div>
         <Field name="gender" value="female" type="radio" />
           <label className="pl-2 font-semibold text-[#445664]">Female</label>
         </div>
          
         </div>
                <div className={errorMessage}>
                <KErrorMessage name="gender" />
                </div>
            </div>

            <div className="pt-5">
            <label className={titleStyle}>Income <span className={spanStyle}>*</span> </label>
            <div className="px-8 pt-1">
            {errors.income && <Field className={`  input2 ${formStyleError}`} name="income" as="select">
              <option>Option Income *</option>
              <option  value="Rp.12000000">Rp.12000000</option>
              <option value="Rp.25000000">Rp.25000000</option>
            </Field> || <Field className={` input ${formStyleDone}`} name="income" as="select">
              <option>Option Income *</option>
              <option value="Rp.12000000">Rp.12000000</option>
              <option value="Rp.25000000">Rp.25000000</option>
            </Field>}
            </div>
            <div className={errorMessage}>
            <KErrorMessage name="income" />
            </div>
            </div>
         
         <div className="pt-5 flex justify-around">
            
         <div>
         <label className={`pl-0${titleStyle}`}>Start date <span className={spanStyle}>*</span></label>
            <div>
            {errors.startDate && <Field className='border py-2 px-4 rounded-md bg-[#F4F8FB] border-red-500 shadow-md input2' name="startDate" type="date" min={formatDate(new Date())} max={values.endDate && formatDate(addDays(values.endDate, -1))}  /> || <Field className='border py-2 px-4 rounded-md border-[#c5cfd9] bg-[#F4F8FB] shadow-md input' name="startDate" type="date" min={formatDate(new Date())} max={values.endDate && formatDate(addDays(values.endDate, -1))}  />}
           <div className='text-sm font-medium pt-1'>
           <KErrorMessage name="startDate"/>
           </div>
            </div>
         </div>
        
         <div>
         <label className={`pl-0${titleStyle}`} >End date <span className={spanStyle}>*</span></label>
            <div>
           {errors.endDate &&  <Field className='border py-2 px-4 rounded-md border-red-500 shadow-md input2 bg-[#F4F8FB] ' name="endDate" type="date" min={values.startDate} /> ||  <Field className='border py-2 px-4 bg-[#F4F8FB] rounded-md border-[#c5cfd9] shadow-md input ' name="endDate" type="date" min={values.startDate} />}
           <div className='text-sm font-medium pt-1'>
           <KErrorMessage name="endDate"/>
           </div>
            </div>
         </div>
         </div>
       
           
     
            <div className="">
          <div className="pt-5">
          <label className={titleStyle}>Describe about you <span className={spanStyle}>*</span></label>
            <div className="px-8 pt-1">
            {errors.about && <Field className={`py-8 input2 ${formStyleError}`} name="about" id='my-text' as="textarea" /> || <Field className={`py-8 input ${formStyleDone}`} name="about" as="textarea" />}
            </div>
            <p id="result"></p>
          </div>
            
            <div className={errorMessage}>
            <KErrorMessage name="about" />
            </div>

            </div>
        
           <div className="pt-5">
           <label className={titleStyle}>Social Media<span className={spanStyle}>*</span></label>
            <div className={errorMessage}>
            <KErrorMessage name="social" />
            </div>
           </div>
         
           <div className="pt-2 pl-8">
           <label className="pr-3 text-[#445664] text-sm">Facebook:</label>
            <Field className="border rounded-md bg-[#F4F8FB] border-[#c5cfd9] py-2 px-5  shadow-md" name="social[0]" type="text" />

            <div className="pl-[85px]">
            {/* <KErrorMessage name="social" /> */}
            </div>
            
           <div className="pt-5">
           <label className="pr-[30px] text-[#445664] text-sm">Twitter:</label>
            <Field className="border rounded-md bg-[#F4F8FB] border-[#c5cfd9] py-2 px-5  shadow-md" name="social[1]" type="text" />
           <div className="pl-[85px]">
           {/* <KErrorMessage name="social" /> */}
           </div>
           </div>
           </div>
            <KErrorMessage name={`hobbies`} /> 

           <div className="pt-8 pl-8">
           <Field className='mr-2'  type='checkbox' name='acceptedTos' />
              <span className="text-medium font-sm text-[#445664]">I accept the terms of service</span>
            
           </div>
           <div className={errorMessage}>
            <KErrorMessage name={`acceptedTos`} />
           </div>


            <div className="pt-8 px-[70px] pb-10">
            <button className="bg-[#475a69] hover:bg-[#394b5a] rounded-full text-white px-7 py-3 w-full text-lg font-semibold duration-300
            " type="submit">Submit</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Main;
