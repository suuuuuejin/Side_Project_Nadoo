import React, { useRef, useState } from 'react';
import { Alert, Button, DatePicker, Input, TimePicker } from 'antd';
import '../../styles/Group/GroupCreate.css'
import DaumPostcode from "react-daum-postcode";
import DaumAddressPopup from './DaumPostCode/DaumAddressPopup';
import NavigatorTop from '../Navigator/NavigatorTop';
import { Outlet } from 'react-router-dom';
import NavigatorMain from '../Navigator/NavigatorMain';
import TextArea from 'antd/es/input/TextArea';
import styled from 'styled-components';
import { GrLocation } from 'react-icons/gr';
import { BiUser } from 'react-icons/bi'
import { AiOutlineFontSize } from 'react-icons/ai';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const CreateCenter = styled.div`
  text-align: center;
`

function GroupCreate(props) {
  const [errorMessage, setErrorMessage] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [groupTitle, setGroupTitle] = useState('');
  const [groupLocation, setGroupLocation] = useState('');
  const [groupArticle, setGroupArticle] = useState('');
  const [groupDate, setGroupDate] = useState('');
  const [groupTime, setGroupTime] = useState('');

  const titleRef = useRef();
  const locationRef = useRef();
  const articleRef = useRef();
  const dateRef = useRef();
  const timeRef = useRef();

  console.log(groupTitle, groupLocation, groupArticle);
  console.log(groupDate, groupTime);

  const errorCheck = () => {
    if (groupTitle === '' || groupTitle === undefined) {
      setErrorMessage(
        <Alert
          message="나두의 제목을 지어주세요!"
          type="error"
          showIcon
          style={{
            width: '90%',
            margin: `0 auto`
          }}
        />
      );
      titleRef.current.focus();
      return false;
    } else {
      setErrorMessage("");
      locationRef.current.focus();
    }

    if (groupLocation === '' || groupLocation === undefined) {
      setErrorMessage(
        <Alert
          message="나두의 위치를 알려주세요!"
          type="error"
          showIcon
          style={{
            width: '90%',
            margin: `0 auto`
          }}
        />
      );
      locationRef.current.focus();
      return false;
    } else {
      setErrorMessage("");
      articleRef.current.focus();
    }

    if (groupArticle === '' || groupArticle === undefined) {
      setErrorMessage(
        <Alert
          message="전하고 싶은 메세지를 작성해주세요!"
          type="error"
          showIcon
          style={{
            width: '90%',
            margin: `0 auto`
          }}
        />
      );
      articleRef.current.focus();
      return false;
    } else {
      setErrorMessage("");
    }
  }

  /** 팝업창 열기 */
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  /** 팝업창 닫기 */
  const closePostCode = () => {
    setIsPopupOpen(false);
  };

  const handlePostCode = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    locationRef.current.value = fullAddress;
    setGroupLocation(fullAddress);
    closePostCode();
  };

  return (
    <>
      <NavigatorTop />
      <Outlet />
      <CreateCenter>
        <p className='GroupCreate_title'>
          👋 나두를 생성해보세요! 👋
          {/* 🚨⏰❗ */}
        </p>
        <Input
          placeholder="나두의 이름은 무엇으로 할까요?"
          style={{
            width: '90%'
          }}
          prefix={<AiOutlineFontSize className="site-form-item-icon" />}
          ref={titleRef}
          onChange={(e) => {
            setGroupTitle(e.target.value);
          }}
        />
        <br />
        <br />
        <div className='GroupCreate_datatime'>
          <DatePicker
            placeholder='날짜를 정해주세요.'
            style={{
              width: '48%'
            }}
            onChange={
              (date, dateString) => {
                setGroupDate(dateString);
              }}
            size="large"
            ref={dateRef}
          />
          &nbsp;
          &nbsp;
          <TimePicker
            style={{
              width: '48%'
            }}
            placeholder='시간을 정해주세요.'
            defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
            size="large"
            onChange={
              (time, timeSting) => {
                setGroupTime(timeSting);
              }
            }
            ref={timeRef}
          />
        </div>
        <br />
        <br />
        <Input
          type="text"
          placeholder="위치는 어디로 할까요?"
          style={{
            width: '90%'
          }}
          ref={locationRef}
          value={groupLocation}
          onClick={() => {
            openPostCode();
            locationRef.current.value = '';
          }}
          onChange={() => {
            openPostCode();
            setGroupLocation(locationRef.current.value);
          }}
          prefix={<GrLocation className="site-form-item-icon" />}
        />
        {/* 팝업 생성 기준 div */}
        <div id="popupDom">
          <br />
          {isPopupOpen && (
            <DaumAddressPopup>
              <div>
                <DaumPostcode onComplete={handlePostCode} />
                {/* 닫기 버튼 생성 */}
                <button
                  type="button"
                  onClick={() => {
                    closePostCode();
                  }}
                  className="GroupCreate_button"
                >
                  닫기
                </button>
              </div>
            </DaumAddressPopup>
          )}
        </div>
        <TextArea
          showCount
          maxLength={200}
          style={{
            height: 160,
            resize: 'none',
            width: '90%'
          }}
          placeholder="전하고 싶은 메시지를 작성해주세요!"
          ref={articleRef}
          onChange={(e) => {
            setGroupArticle(e.target.value);
          }}
        />
        <br />
        <br />
        <Button
          type="primary"
          onClick={
            () => {
              errorCheck();
            }
          }
        >
          나두 만들기
        </Button>
        <br />
        <br />
        {errorMessage}
      </CreateCenter>
      <NavigatorMain />
      <Outlet />
    </>
  );
}

export default GroupCreate;