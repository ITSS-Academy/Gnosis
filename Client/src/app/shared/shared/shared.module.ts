import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiComboBoxModule,
  TuiFilesModule,
  TuiMarkerIconModule,
  TuiPushModule,
  TuiStepperModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule, TuiValidatorModule } from '@taiga-ui/cdk';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { TuiGroupModule } from '@taiga-ui/core';
import { TuiCarouselModule } from '@taiga-ui/kit';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiTagModule } from '@taiga-ui/kit';
import { TuiPaginationModule } from '@taiga-ui/kit';
import { TuiScrollbarModule } from '@taiga-ui/core';
import { TuiDataListModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule } from '@taiga-ui/kit';
import { TuiSelectModule } from '@taiga-ui/kit';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { TuiFieldErrorPipeModule } from '@taiga-ui/kit';
import { TuiErrorModule } from '@taiga-ui/core';
import { TuiInputSliderModule } from '@taiga-ui/kit';
import { TuiInputNumberModule } from '@taiga-ui/kit';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';
import { TuiInputDateModule } from '@taiga-ui/kit';
import { TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiInputPhoneModule } from '@taiga-ui/kit';
import { TuiRadioBlockModule } from '@taiga-ui/kit';
import { TuiInputTimeModule } from '@taiga-ui/kit';
import { TuiCheckboxLabeledModule } from '@taiga-ui/kit';
import { TuiTooltipModule, TuiHintModule } from '@taiga-ui/core';
import { TuiPrimitiveCheckboxModule } from '@taiga-ui/core';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiNotificationModule } from '@taiga-ui/core';
import { TuiInputFilesModule } from '@taiga-ui/kit';
import { TuiLabelModule } from '@taiga-ui/core';
import { TuiPrimitiveTextfieldModule } from '@taiga-ui/core';
import { TuiHostedDropdownModule } from '@taiga-ui/core';
import { TuiDropdownModule } from '@taiga-ui/core';
import { TuiFilterByInputPipeModule } from '@taiga-ui/kit';
import { TuiExpandModule } from '@taiga-ui/core';
import { TuiRatingModule } from '@taiga-ui/kit';
import { TuiInputDateTimeModule } from '@taiga-ui/kit';
import { TuiActionModule } from '@taiga-ui/kit';
import { TuiRingChartModule } from '@taiga-ui/addon-charts';
import { TuiProgressModule } from '@taiga-ui/kit';
import { TuiTilesModule } from '@taiga-ui/kit';
import { TuiRadioLabeledModule } from '@taiga-ui/kit';
import { TuiOverscrollModule } from '@taiga-ui/cdk';
import { TuiRadioListModule } from '@taiga-ui/kit';
import { TuiRadioModule } from '@taiga-ui/kit';
import { TuiCalendarModule } from '@taiga-ui/core';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { TuiLinkModule } from '@taiga-ui/core';
import { TuiMultiSelectModule } from '@taiga-ui/kit';
import { TuiCheckboxBlockModule } from '@taiga-ui/kit';
import { TuiPreviewModule } from '@taiga-ui/addon-preview';
import { TuiLineClampModule } from '@taiga-ui/kit';
import { TuiFilterModule } from '@taiga-ui/kit';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiAccordionModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
    TuiMarkerIconModule,
    TuiInputModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiAvatarModule,
    TuiGroupModule,
    TuiCarouselModule,
    TuiIslandModule,
    TuiTagModule,
    TuiPaginationModule,
    TuiScrollbarModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiComboBoxModule,
    TuiSelectModule,
    TuiTableModule,
    TuiLetModule,
    TuiTablePaginationModule,
    TuiCheckboxModule,
    TuiMoneyModule,
    TuiFieldErrorPipeModule,
    TuiErrorModule,
    TuiInputSliderModule,
    TuiInputNumberModule,
    TuiCurrencyPipeModule,
    TuiInputDateModule,
    TuiInputPasswordModule,
    TuiInputPhoneModule,
    TuiRadioBlockModule,
    TuiInputTimeModule,
    TuiCheckboxLabeledModule,
    TuiTooltipModule,
    TuiHintModule,
    TuiPrimitiveCheckboxModule,
    TuiLoaderModule,
    TuiNotificationModule,
    TuiInputFilesModule,
    TuiLabelModule,
    TuiPrimitiveTextfieldModule,
    TuiHostedDropdownModule,
    TuiDropdownModule,
    TuiFilterByInputPipeModule,
    TuiExpandModule,
    TuiRatingModule,
    TuiInputDateTimeModule,
    TuiActionModule,
    TuiValidatorModule,
    TuiRingChartModule,
    TuiProgressModule,
    TuiTilesModule,
    TuiRadioLabeledModule,
    TuiStepperModule,
    TuiPushModule,
    TuiFilesModule,
    TuiOverscrollModule,
    TuiRadioListModule,
    TuiRadioModule,
    TuiCalendarModule,
    TuiTabsModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    TuiMultiSelectModule,
    TuiCheckboxBlockModule,
    TuiPreviewModule,
    TuiLineClampModule,
    TuiFilterModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TuiAccordionModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
    TuiMarkerIconModule,
    TuiInputModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiAvatarModule,
    TuiGroupModule,
    TuiCarouselModule,
    TuiIslandModule,
    TuiTagModule,
    TuiPaginationModule,
    TuiScrollbarModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiComboBoxModule,
    TuiSelectModule,
    TuiTableModule,
    TuiLetModule,
    TuiTablePaginationModule,
    TuiCheckboxModule,
    TuiMoneyModule,
    TuiFieldErrorPipeModule,
    TuiErrorModule,
    TuiInputSliderModule,
    TuiInputNumberModule,
    TuiCurrencyPipeModule,
    TuiInputDateModule,
    TuiInputPasswordModule,
    TuiInputPhoneModule,
    TuiRadioBlockModule,
    TuiInputTimeModule,
    TuiCheckboxLabeledModule,
    TuiTooltipModule,
    TuiHintModule,
    TuiPrimitiveCheckboxModule,
    TuiLoaderModule,
    TuiNotificationModule,
    TuiInputFilesModule,
    TuiLabelModule,
    TuiPrimitiveTextfieldModule,
    TuiHostedDropdownModule,
    TuiDropdownModule,
    TuiFilterByInputPipeModule,
    TuiExpandModule,
    TuiRatingModule,
    TuiInputDateTimeModule,
    TuiActionModule,
    TuiValidatorModule,
    TuiRingChartModule,
    TuiProgressModule,
    TuiTilesModule,
    TuiRadioLabeledModule,
    TuiStepperModule,
    TuiPushModule,
    TuiFilesModule,
    TuiOverscrollModule,
    TuiRadioModule,
    TuiCalendarModule,
    TuiTabsModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    TuiMultiSelectModule,
    TuiCheckboxBlockModule,
    TuiPreviewModule,
    TuiLineClampModule,
    TuiFilterModule,
  ],
})
export class SharedModule {}
