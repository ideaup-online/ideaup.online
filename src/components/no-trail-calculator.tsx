import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import {
  Field,
  DoubleField,
  DropDownSelectField,
  Button,
} from './fancy-fields';

//
// Container style
//

const Container = styled.div`
  display: grid;
  padding: 1em;
  background: var(--default-bg-color);
  box-shadow: 0 0 0.3rem var(--base-color);
  border-radius: 0.5em;
`;

const LeftColumn = styled.div`
  grid-column: 1 / auto;
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  grid-column: 2 / auto;
  display: flex;
  flex-direction: column;
`;

const ColumnHeading = styled.div`
  color: var(--base-color);
  text-align: center;
  padding-top: 0.5em;
`;

const CenteredHeading = styled(ColumnHeading)`
  grid-column: 1 / span 2;
  font-size: 1.25em;
  font-weight: 400;
`;

const PaddedCenteredHeading = styled(CenteredHeading)`
  padding-top: 1em;
`;

const popularSensorTypes = [
  { type: 'Full Frame', width: 36, height: 24 },
  { type: 'APS-C', width: 24, height: 16 },
  { type: 'APS-C (Canon)', width: 22.2, height: 14.8 },
  { type: 'Micro 4/3', width: 17.3, height: 13 },
];

// The number of seconds in a sidereal day
// (Earth's rotation period relative to the
// fixed stars). This number is according
// to the International Earth Rotation and
// Reference Systems Service (IERS)
const siderealDaySecs = 86164.098903691;
const earthAngularSpeedArcsecPerSec = (360 * 3600) / siderealDaySecs;

const NoTrailCalculator = (props: any): JSX.Element => {
  function calculateAndUpdate() {
    // Constants
    const fullFrameWidth_mm = 36;
    const fullFrameHeight_mm = 24;

    // Get the current values
    const focalLen = (
      document.getElementById('focal-length-mm') as HTMLInputElement
    )?.value;
    const sensorWidth_mm = (
      document.getElementById('sensor-width-mm') as HTMLInputElement
    )?.value;
    const sensorHeight_mm = (
      document.getElementById('sensor-height-mm') as HTMLInputElement
    )?.value;
    const resolution_mp = (
      document.getElementById('pixel-density-megapix') as HTMLInputElement
    )?.value;
    const exposureTime_secs = (
      document.getElementById('exposure-time-secs') as HTMLInputElement
    )?.value;
    const popularSensor_idx = (
      document.getElementById('sensor-type') as HTMLSelectElement
    )?.selectedIndex;

    // Do the math with the current values
    if (
      focalLen !== '' &&
      sensorWidth_mm !== '' &&
      sensorHeight_mm !== '' &&
      resolution_mp !== ''
    ) {
      // Convert resolution to pixels
      const resolution = Number(resolution_mp) * 1000000;

      // Convert sensor width and height
      // to number
      const sensorWidth_mm_num = Number(sensorWidth_mm);
      const sensorHeight_mm_num = Number(sensorHeight_mm);

      // Determine sensor width in pixels
      // (sqrt(resolution * aspect_ratio))
      const sensorWidth_px = Math.sqrt(
        resolution * (sensorWidth_mm_num / sensorHeight_mm_num),
      );

      // Determine the sensor diagonal length in mm
      // (a squared + b squared = c squared)
      const sensorDiag_mm = Math.sqrt(
        sensorWidth_mm_num * sensorWidth_mm_num +
          sensorHeight_mm_num * sensorHeight_mm_num,
      );

      // Determine the diagonal length of full frame in mm
      const fullFrameDiag_mm = Math.sqrt(
        fullFrameWidth_mm * fullFrameWidth_mm +
          fullFrameHeight_mm * fullFrameHeight_mm,
      );

      // Crop factor is ratio of sensor diag to full frame diag
      const cropFactor = fullFrameDiag_mm / sensorDiag_mm;

      // Calculate pixel size in microns
      // (sensor_width_microns / sensor_width_pixels)
      const sensorPixelSizeMicrons =
        (sensorWidth_mm_num * 1000) / sensorWidth_px;

      // Calculate FOV for a single pixel in radians
      const sensorAngularResolutionRadians =
        2 * Math.atan(sensorPixelSizeMicrons / (2 * (Number(focalLen) * 1000)));

      // In degrees
      const sensorAngularResolutionDegrees =
        sensorAngularResolutionRadians * (180 / Math.PI);

      // And finally in arcseconds
      const sensorAngularResolutionArcsecs =
        sensorAngularResolutionDegrees * 3600;

      // Update fields
      (
        document.getElementById('sensor-angular-resolution') as HTMLInputElement
      ).value = sensorAngularResolutionArcsecs.toFixed(2);
      (
        document.getElementById('sensor-pixel-size-microns') as HTMLInputElement
      ).value = sensorPixelSizeMicrons.toFixed(2);
      const earthMotionPxPerSec =
        earthAngularSpeedArcsecPerSec / sensorAngularResolutionArcsecs;
      (document.getElementById('earth-motion') as HTMLInputElement).value =
        earthMotionPxPerSec.toFixed(2);
      const seconds500Rule = 500 / (Number(focalLen) * cropFactor);
      (document.getElementById('seconds-500-rule') as HTMLInputElement).value =
        seconds500Rule.toFixed(2);
      (document.getElementById('pixels-moved') as HTMLInputElement).value = (
        Number(exposureTime_secs) * earthMotionPxPerSec
      ).toFixed(2);
      (
        document.getElementById('pixels-moved-500-rule') as HTMLInputElement
      ).value = (seconds500Rule * earthMotionPxPerSec).toFixed(2);
    } else {
      // Clear fields
      (
        document.getElementById('sensor-angular-resolution') as HTMLInputElement
      ).value = '';
      (
        document.getElementById('sensor-pixel-size-microns') as HTMLInputElement
      ).value = '';
      (document.getElementById('earth-motion') as HTMLInputElement).value = '';
      (document.getElementById('seconds-500-rule') as HTMLInputElement).value =
        '';
      (document.getElementById('pixels-moved') as HTMLInputElement).value = '';
      (
        document.getElementById('pixels-moved-500-rule') as HTMLInputElement
      ).value = '';
    }

    // Update popular sensor size
    (
      document.getElementById('popular-sensor-width-mm') as HTMLInputElement
    ).value = popularSensorTypes[popularSensor_idx].width.toFixed();
    (
      document.getElementById('popular-sensor-height-mm') as HTMLInputElement
    ).value = popularSensorTypes[popularSensor_idx].height.toFixed();
  }

  function handleChange() {
    calculateAndUpdate();
  }

  function sendToCalcClicked() {
    (document.getElementById('sensor-width-mm') as HTMLInputElement).value = (
      document.getElementById('popular-sensor-width-mm') as HTMLInputElement
    ).value;
    (document.getElementById('sensor-height-mm') as HTMLInputElement).value = (
      document.getElementById('popular-sensor-height-mm') as HTMLInputElement
    ).value;
    calculateAndUpdate();
  }

  useEffect(() => {
    calculateAndUpdate();
  }, []);

  return (
    <div>
      <Container className={props.className || ''} id={props.id || ''}>
        <CenteredHeading>Untracked Star Motion Calculator</CenteredHeading>
        <LeftColumn>
          <ColumnHeading>You Supply These</ColumnHeading>
          <Field
            label="Focal Length:"
            decorator="mm"
            inputProps={{
              id: 'focal-length-mm',
              type: 'number',
              defaultValue: 14,
              onChange: handleChange,
            }}
          />
          <DoubleField
            label="Sensor Size:"
            decorator="mm"
            // decoratorPosition="left"
            middleDecorator="x"
            inputPropsLeft={{
              id: 'sensor-width-mm',
              type: 'number',
              defaultValue: 36,
              onChange: handleChange,
            }}
            inputPropsRight={{
              id: 'sensor-height-mm',
              type: 'number',
              defaultValue: 24,
              onChange: handleChange,
            }}
          />
          <Field
            label="Resolution:"
            decorator="mp"
            inputProps={{
              id: 'pixel-density-megapix',
              type: 'number',
              defaultValue: 24.3,
              onChange: handleChange,
            }}
          />
          <Field
            label="Exposure Time:"
            decorator="sec"
            inputProps={{
              id: 'exposure-time-secs',
              type: 'number',
              defaultValue: 20,
              onChange: handleChange,
            }}
          />
        </LeftColumn>
        <RightColumn>
          <ColumnHeading>{"We'll Calculate These"}</ColumnHeading>
          <Field
            label="Sensor Pixel Size:"
            decorator="μm"
            inputProps={{
              id: 'sensor-pixel-size-microns',
              type: 'text',
              readOnly: true,
            }}
          />
          <Field
            label="Sensor Angular Resolution:"
            decorator="arcsec/px"
            inputProps={{
              id: 'sensor-angular-resolution',
              type: 'text',
              readOnly: true,
            }}
          />
          <Field
            label="Sensor Apparent Motion:"
            decorator="px/sec"
            inputProps={{
              id: 'earth-motion',
              type: 'text',
              readOnly: true,
            }}
          />
          <Field
            label="Exposure Pixels Moved:"
            decorator="px"
            inputProps={{
              id: 'pixels-moved',
              type: 'text',
              readOnly: true,
            }}
          />
        </RightColumn>
        <PaddedCenteredHeading>Popular Sensor Types</PaddedCenteredHeading>
        <LeftColumn>
          <DropDownSelectField
            label="Sensor Type:"
            inputProps={{
              id: 'sensor-type',
              onChange: handleChange,
              items: popularSensorTypes.map((item) => {
                return item.type;
              }),
            }}
          />
        </LeftColumn>
        <RightColumn>
          <DoubleField
            label="Sensor Size:"
            decorator="mm"
            middleDecorator="x"
            inputPropsLeft={{
              id: 'popular-sensor-width-mm',
              type: 'text',
              readOnly: true,
            }}
            inputPropsRight={{
              id: 'popular-sensor-height-mm',
              type: 'text',
              readOnly: true,
            }}
          />
          <Button id="send-to-calc-button" onClick={sendToCalcClicked}>
            Send to Calculator
          </Button>
        </RightColumn>
        <PaddedCenteredHeading>
          500 Rule Guideline (for Comparison)
        </PaddedCenteredHeading>
        <LeftColumn>
          {' '}
          <Field
            label="500 Rule Exposure Time:"
            decorator="sec"
            inputProps={{
              id: 'seconds-500-rule',
              type: 'text',
              readOnly: true,
            }}
          />
        </LeftColumn>
        <RightColumn>
          {' '}
          <Field
            label="500 Rule Pixels Moved:"
            decorator="px"
            inputProps={{
              id: 'pixels-moved-500-rule',
              type: 'text',
              readOnly: true,
            }}
          />
        </RightColumn>
      </Container>
    </div>
  );
};

export default NoTrailCalculator;
