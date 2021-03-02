import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import {
  RadioListConditional,
  RadioListItemConditional,
  RadioListItemHint,
} from "../../components/RadioList";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { MaritimePleasureVessel } from "../../lib/types";

const defineFormRules = ({
  maritimePleasureVesselUse,
  otherPleasureVesselText,
}: CacheEntry): FormManager => {
  return new FormManager({
    maritimePleasureVesselUse: new FieldManager(maritimePleasureVesselUse, [
      Validators.required("Maritime pleasure use is a required field"),
    ]),
    otherPleasureVesselText: new FieldManager(
      otherPleasureVesselText,
      [Validators.required("Other pleasure vessel text is a required field")],
      [
        {
          dependsOn: "maritimePleasureVesselUse",
          meetingCondition: (value) => value === MaritimePleasureVessel.OTHER,
        },
      ]
    ),
  });
};

const PrimaryBeaconUse: FunctionComponent<FormPageProps> = ({
  form,
}: FormPageProps): JSX.Element => {
  return (
    <Layout
      title={
        "What type of maritime pleasure vessel will you mostly use this beacon on?"
      }
      navigation={<BackButton href="/register-a-beacon/beacon-information" />}
      pageHasErrors={form.hasErrors}
    >
      <Grid
        mainContent={
          <>
            <FormErrorSummary formErrors={form.errorSummary} />
            <Form action="/register-a-beacon/primary-beacon-use">
              <FormGroup
                errorMessages={
                  form.fields.maritimePleasureVesselUse.errorMessages
                }
              >
                <FormFieldset>
                  <FormLegendPageHeading>
                    What type of maritime pleasure vessel will you mostly use
                    this beacon on?
                  </FormLegendPageHeading>
                </FormFieldset>
                <RadioListConditional>
                  <RadioListItemHint
                    id="motor-vessel"
                    name="maritimePleasureVesselUse"
                    value={MaritimePleasureVessel.MOTOR}
                    hintText="E.g. Speedboat, RIB"
                    inputHtmlAttributes={setCheckedIfUserSelected(
                      form.fields.maritimePleasureVesselUse.value,
                      MaritimePleasureVessel.MOTOR
                    )}
                  >
                    Motor vessel
                  </RadioListItemHint>
                  <RadioListItemHint
                    id="sailing-vessel"
                    name="maritimePleasureVesselUse"
                    value={MaritimePleasureVessel.SAILING}
                    hintText="E.g. Skiff, Dinghy, Yacht, Catamaran"
                    inputHtmlAttributes={setCheckedIfUserSelected(
                      form.fields.maritimePleasureVesselUse.value,
                      MaritimePleasureVessel.SAILING
                    )}
                  >
                    Sailing vessel
                  </RadioListItemHint>
                  <RadioListItemHint
                    id="rowing-vessel"
                    name="maritimePleasureVesselUse"
                    value={MaritimePleasureVessel.ROWING}
                    hintText="E.g. Single person rowing boat, Cornish Gig, Multi-person rowing boat"
                    inputHtmlAttributes={setCheckedIfUserSelected(
                      form.fields.maritimePleasureVesselUse.value,
                      MaritimePleasureVessel.ROWING
                    )}
                  >
                    Rowing vessel
                  </RadioListItemHint>
                  <RadioListItemHint
                    id="small-unpowered-vessel"
                    name="maritimePleasureVesselUse"
                    value={MaritimePleasureVessel.SMALL_UNPOWERED}
                    hintText="E.g. Canoe, Kayak"
                    inputHtmlAttributes={setCheckedIfUserSelected(
                      form.fields.maritimePleasureVesselUse.value,
                      MaritimePleasureVessel.SMALL_UNPOWERED
                    )}
                  >
                    Small unpowered vessel
                  </RadioListItemHint>
                  <RadioListItemHint
                    id="other-pleasure-vessel"
                    name="maritimePleasureVesselUse"
                    value={MaritimePleasureVessel.OTHER}
                    hintText="E.g. Surfboard, Kitesurfing"
                    inputHtmlAttributes={{
                      ...{
                        "data-aria-controls":
                          "conditional-other-pleasure-vessel",
                      },
                      ...setCheckedIfUserSelected(
                        form.fields.maritimePleasureVesselUse.value,
                        MaritimePleasureVessel.OTHER
                      ),
                    }}
                  >
                    Other pleasure vessel
                  </RadioListItemHint>
                  <RadioListItemConditional id="conditional-other-pleasure-vessel">
                    <FormGroup
                      errorMessages={
                        form.fields.otherPleasureVesselText.errorMessages
                      }
                    >
                      <Input
                        id="otherPleasureVesselText"
                        label="What sort of vessel is it?"
                        defaultValue={form.fields.otherPleasureVesselText.value}
                      />
                    </FormGroup>
                  </RadioListItemConditional>
                </RadioListConditional>
              </FormGroup>

              <Button buttonText="Continue" />
            </Form>

            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  );
};

const setCheckedIfUserSelected = (userSelectedValue, componentValue) => {
  return {
    defaultChecked: userSelectedValue === componentValue,
  };
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/about-the-vessel",
  defineFormRules
);

export default PrimaryBeaconUse;
