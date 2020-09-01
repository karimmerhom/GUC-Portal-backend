const express = require('express')

const router = express.Router()
const {
  validateCreate,
  validateViewCourse,
  validateViewAllCourses,
  validateEditCourse,
  validateDeleteCourse,
  validateViewAllCoursesAdmin,
  validateStateChange,
} = require('../helpers/validations/coursesValidations')
const coursesController = require('../controllers/Organize/Courses.controller')

const {
  viewCourse,
  createCourse,
  viewAllCourses,
  editCourse,
  deleteCourse,
  viewAllCoursesAdmin,
  stateChange,
} = coursesController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
const { verifiedPhone } = require('../../config/verifiedAuthentication')

router.post(
  '/createCourse',
  validateCreate,
  verifyToken,
  verifyUser,
  verifiedPhone,
  createCourse
)
router.post(
  '/viewCourse',
  validateViewCourse,
  verifyToken,
  verifyUser,
  verifiedPhone,

  viewCourse
)
router.post(
  '/viewAllCourses',
  validateViewAllCourses,
  verifyToken,
  verifyUser,
  verifiedPhone,
  viewAllCourses
)
router.post(
  '/editCourse',
  validateEditCourse,
  verifyToken,
  verifyUser,
  verifiedPhone,
  editCourseimport React, { useEffect } from 'react'

  import axios from 'axios'
  
  import { withStyles, makeStyles } from '@material-ui/core/styles'
  import Table from '@material-ui/core/Table'
  import TableBody from '@material-ui/core/TableBody'
  import TableCell from '@material-ui/core/TableCell'
  import TableContainer from '@material-ui/core/TableContainer'
  import TableHead from '@material-ui/core/TableHead'
  import TableRow from '@material-ui/core/TableRow'
  import Paper from '@material-ui/core/Paper'
  import Button from '@material-ui/core/Button'
  
  import backGroundHeader from './../../../images/backgroundCalendarHeader.png'
  import { useSelector } from 'react-redux'
  import { useParams } from 'react-router'
  
  const StyledTableCell = withStyles((theme) => ({
    head: {
      height: '1vw',
      color: theme.palette.common.black,
      fontSize: ' 0.5vw',
      alignItems: 'bottom',
      verticalAlign: 'bottom',
      paddingTop: '2.8vw',
      paddingBottom: '0vw',
      display: 'inlineBlock',
    },
  
    body: {
      borderStyle: 'ridge',
      borderWidth: '1px',
      fontSize: ' 0.7vw',
    },
  }))(TableCell)
  
  const StyledTableRow = withStyles((theme) => ({
    root: {},
  }))(TableRow)
  
  const useStyles = makeStyles({
    table: {
      minWidth: 700,
    },
  })
  
  export default function CustomizedTables(props) {
    const token = useSelector((state) => state.token)
    const id = useSelector((state) => state.id)
    const bookingId = useParams().bookingId
    const date = props.date
    const c = [
      {
        roomNumber: 1,
        filtered: false,
        notFreeSlots: [],
      },
      {
        roomNumber: 2,
        filtered: false,
        notFreeSlots: [
          {
            slotName: 'NINE_TEN',
            status: 'confirmed',
          },
          {
            slotName: 'TEN_ELEVEN',
            status: 'pending',
          },
  
          {
            slotName: 'TWELVE_THIRTEEN',
            status: 'confirmed',
          },
  
          {
            slotName: 'SEVENTEEN_EIGHTEEN',
            status: 'pending',
          },
          {
            slotName: 'EIGHTEEN_NINETEEN',
            status: 'pending',
          },
        ],
      },
      {
        roomNumber: 3,
        filtered: false,
        notFreeSlots: [
          {
            slotName: 'NINE_TEN',
            status: 'confirmed',
          },
          {
            slotName: 'TEN_ELEVEN',
            status: 'pending',
          },
          {
            slotName: 'ELEVEN_TWELVE',
            status: 'Free',
          },
  
          {
            slotName: 'FOURTEEN_FIFTEEN',
            status: 'confirmed',
          },
          {
            slotName: 'FIFTEEN_SIXTEEN',
            status: 'confirmed',
          },
          {
            slotName: 'SIXTEEN_SEVENTEEN',
            status: 'pending',
          },
  
          {
            slotName: 'NINETEEN_TWENTY',
            status: 'confirmed',
          },
          {
            slotName: 'TWENTY_TWENTYONE',
            status: 'pending',
          },
        ],
      },
      {
        roomNumber: 4,
        filtered: false,
        notFreeSlots: [
          {
            slotName: 'NINE_TEN',
            status: 'confirmed',
          },
          {
            slotName: 'TEN_ELEVEN',
            status: 'pending',
          },
          {
            slotName: 'ELEVEN_TWELVE',
            status: 'Free',
          },
          {
            slotName: 'TWELVE_THIRTEEN',
            status: 'confirmed',
          },
          {
            slotName: 'THIRTEEN_FOURTEEN',
            status: 'confirmed',
          },
          {
            slotName: 'FOURTEEN_FIFTEEN',
            status: 'confirmed',
          },
          {
            slotName: 'FIFTEEN_SIXTEEN',
            status: 'confirmed',
          },
          {
            slotName: 'SIXTEEN_SEVENTEEN',
            status: 'pending',
          },
          {
            slotName: 'SEVENTEEN_EIGHTEEN',
            status: 'confirmed',
          },
          {
            slotName: 'EIGHTEEN_NINETEEN',
            status: 'confirmed',
          },
          {
            slotName: 'NINETEEN_TWENTY',
            status: 'confirmed',
          },
          {
            slotName: 'TWENTY_TWENTYONE',
            status: 'pending',
          },
        ],
      },
    ]
    const classes = useStyles()
    const [calendar, setCalendar] = React.useState(c)
    const [rows, setRows] = React.useState([[], [], [], []])
    const [roomSelected, setRoomSelected] = React.useState('none')
    const [slotsSelected, setSlotsSelected] = React.useState(0)
    const [slotsNamesSelected, setSlotsNameSelected] = React.useState([])
  
    useEffect(() => {
      // if (!dispatch(checkTokenExpired(history))) {
      let newDate = new Date(date).setHours(0, 0, 0, 0)
      axios({
        url: 'http://thebusinesshub.herokuapp.com/tbhapp/booking/viewCalendar',
        method: 'POST',
        headers: {
          authorization: token,
        },
        data: {
          Account: { id },
          startDate: newDate,
        },
      }).then((res) => {
        setRows([[], [], [], []])
        if (res.data.calendar === undefined) {
        } else {
          setCalendar(res.data.calendar)
  
          let rows1 = []
          let added = false
          let numberOfSlots = 0
          res.data.calendar.map((room) => {
            let row = []
            for (var i = 0; i < slots.length; i++) {
              let slott = slots[i]
  
              room.notFreeSlots.map((slot) => {
                if (slot.slotName === slott) {
                  if (`${slot.bookingId}` === bookingId) {
                    setRoomSelected(`room${room.roomNumber}`)
                    props.setRoomSelectedP(`room${room.roomNumber}`)
                    let v = slotsNamesSelected
                    v.push(slot.slotName)
                    setSlotsNameSelected(v)
                    props.setSlotsNameSelectedP(v)
                    console.log(numberOfSlots)
                    numberOfSlots += 1
                    console.log(numberOfSlots)
                    added = true
                  }
                  return row.push([
                    slot.status,
                    slot.accountId,
                    `${slot.bookingId}`,
                  ])
                }
              })
              setSlotsSelected(numberOfSlots)
              if (row[i] === undefined) {
                row.push(['Free'])
              }
            }
            rows1.push(row)
          })
          setRows(rows1)
  
          if (!added) {
            setRoomSelected('none')
            props.setRoomSelectedP('none')
            setSlotsSelected(0)
            setSlotsNameSelected([])
            props.setSlotsNameSelectedP([])
          }
        }
      })
      // }
      // Update the document title using the browser API  })
    }, [props.date])
  
    let slots = [
      'NINE_TEN',
      'TEN_ELEVEN',
      'ELEVEN_TWELVE',
      'TWELVE_THIRTEEN',
      'THIRTEEN_FOURTEEN',
      'FOURTEEN_FIFTEEN',
      'FIFTEEN_SIXTEEN',
      'SIXTEEN_SEVENTEEN',
      'SEVENTEEN_EIGHTEEN',
      'EIGHTEEN_NINETEEN',
      'NINETEEN_TWENTY',
      'TWENTY_TWENTYONE',
    ]
  
    const reply_click = (e) => {
      if (slotsSelected === 0) {
        setRoomSelected('none')
        props.setRoomSelectedP('none')
      }
      if (roomSelected === 'none') {
        console.log('none1')
        if (e.target.style.backgroundColor === 'transparent') {
          console.log('none2')
          e.target.style.backgroundColor = '#0EBDB3'
          setRoomSelected(e.target.id.substring(0, 5))
          props.setRoomSelectedP(e.target.id.substring(0, 5))
  
          setSlotsSelected(1)
          setSlotsNameSelected([slots[parseInt(e.target.id.substring(6, 7))]])
          props.setSlotsNameSelectedP([
            slots[parseInt(e.target.id.substring(6, 7))],
          ])
        } else {
          console.log('none3')
          e.target.style.backgroundColor = 'transparent'
        }
      } else {
        if (e.target.style.backgroundColor === 'transparent') {
          console.log('none4')
          if (e.target.id.substring(0, 5) === roomSelected) {
            console.log('none5')
            e.target.style.backgroundColor = '#0EBDB3'
            setSlotsSelected(slotsSelected + 1)
            let v = slotsNamesSelected
            console.log(slotsSelected)
            console.log(v)
            console.log(e.target.id)
            v[slotsSelected] = slots[parseInt(e.target.id.substring(6, 7))]
            console.log(v)
            setSlotsNameSelected(v)
            props.setSlotsNameSelectedP(v)
          }
        } else {
          console.log('none6')
          e.target.style.backgroundColor = 'transparent'
          if (slotsSelected - 1 === 0) {
            setRoomSelected('none')
            props.setRoomSelectedP('none')
          }
          setSlotsSelected(slotsSelected - 1)
          let v = slotsNamesSelected
          const x = v.indexOf(slots[parseInt(e.target.id.substring(6, 7))])
          v.splice(x, 1)
          setSlotsNameSelected(v)
          props.setSlotsNameSelectedP(v)
        }
      }
    }
  
    return (
      <TableContainer
        component={Paper}
        style={{
          backgroundImage: `url(${backGroundHeader})`,
          backgroundSize: '100% 25%',
          backgroundRepeat: 'no-repeat',
          width: '100%',
        }}
      >
        <Table className={classes.table} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell style={{ marginLeft: '100vw' }} align='right'>
                9:00&nbsp;AM
              </StyledTableCell>
              <StyledTableCell align='center'>10:00&nbsp;AM</StyledTableCell>
              <StyledTableCell align='center'>11:00&nbsp;AM</StyledTableCell>
              <StyledTableCell align='center'>12:00&nbsp;PM</StyledTableCell>
              <StyledTableCell align='center'>1:00&nbsp;PM</StyledTableCell>
              <StyledTableCell align='center'>2:00&nbsp;PM</StyledTableCell>
              <StyledTableCell align='center'>3:00&nbsp;PM</StyledTableCell>
              <StyledTableCell align='center'>4:00&nbsp;PM</StyledTableCell>
              <StyledTableCell align='center'>5:00&nbsp;PM</StyledTableCell>
              <StyledTableCell align='center'>6:00&nbsp;PM</StyledTableCell>
              <StyledTableCell align='center'>7:00&nbsp;PM</StyledTableCell>
              <StyledTableCell align='center'>8:00&nbsp;PM</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ backgroundColor: 'white' }}>
            {calendar.map((room, index) => (
              <StyledTableRow key={room.roomNumber}>
                <StyledTableCell
                  style={{ fontWeight: 'bold', fontSize: '0.7vw' }}
                  component='th'
                  scope='row'
                >
                  ROOM{room.roomNumber}
                </StyledTableCell>
  
                {rows[index].map((row, index) => {
                  if (row[0] === 'Free') {
                    return (
                      <StyledTableCell
                        align='center'
                        style={{ padding: '0', width: '20vw' }}
                      >
                        <Button
                          id={'room' + room.roomNumber + '/' + index}
                          onClick={(e) => {
                            reply_click(e)
                            // slotsify(index)
                          }}
                          color='primary'
                          style={{
                            borderRadius: '0',
                            backgroundColor: 'transparent',
                            border: 'none',
                            height: '3.5vw',
                            width: '4vw',
                          }}
                          type='submit'
                        ></Button>
                      </StyledTableCell>
                    )
                  }
                  if (row[0] === 'pending') {
                    if (row[1] === id) {
                      if (row[2] === bookingId) {
                        return (
                          <StyledTableCell
                            align='center'
                            style={{ padding: '0', width: '4vw' }}
                          >
                            <Button
                              id={'room' + room.roomNumber + '/' + index}
                              onClick={(e) => {
                                reply_click(e)
                                // slotsify(index)
                              }}
                              color='#0EBDB3'
                              style={{
                                borderRadius: '0',
                                backgroundColor: '#0EBDB3',
                                border: 'none',
                                height: '3.5vw',
                                width: '4vw',
                              }}
                              type='submit'
                            ></Button>
                          </StyledTableCell>
                        )
                      } else {
                        return (
                          <StyledTableCell
                            style={{ backgroundColor: 'black', width: '4vw' }}
                            align='center'
                          >
                            {row[0]}
                          </StyledTableCell>
                        )
                      }
                    } else
                      return (
                        <StyledTableCell
                          style={{ backgroundColor: '#C4C4C4', width: '4vw' }}
                          align='center'
                        >
                          {row[0]}
                        </StyledTableCell>
                      )
                  }
                  if (row[0] === 'confirmed') {
                    return (
                      <StyledTableCell
                        style={{ backgroundColor: '#FF6868', width: '4vw' }}
                        align='center'
                      >
                        {row[0]}
                      </StyledTableCell>
                    )
                  }
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  
)
router.post(
  '/deleteCourse',
  validateDeleteCourse,
  verifyToken,
  verifyUser,
  verifiedPhone,
  deleteCourse
)

router.post(
  '/viewAllCoursesAdmin',
  validateViewAllCoursesAdmin,
  verifyAdmin,

  viewAllCoursesAdmin
)

router.post('/StateChange', validateStateChange, verifyAdmin, stateChange)
// router.post('/verify', verifyToken, verify)

module.exports = router
